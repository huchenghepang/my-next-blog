#!/bin/bash
# deploy.sh - CI/CD 专用部署脚本（用户目录版）
# 用法: ./deploy.sh [environment] [--dry-run]
# 要求:
#   - 已构建好 .next/ 目录
#   - Node.js + npm 已安装
set -euo pipefail

APP_NAME="sky_blog"
ENV=${1:-production}
DRY_RUN=false

# 支持 --dry-run 参数
if [[ "${2:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "[DRY-RUN] 模拟部署，不实际启动进程"
fi

# ───────────────────────────────────────
# 🎨 颜色定义
if [ -t 1 ] || [ "${CI:-false}" = "true" ]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; NC=''
fi

log() { echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }
info() { echo -e "${YELLOW}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# ───────────────────────────────────────
# 🔐 使用用户目录（~/.pm2）而不是项目目录
# 这是 PM2 的默认行为，便于管理多个项目
log "▶️  开始部署: $APP_NAME ($ENV)"

# ───────────────────────────────────────
# 1️⃣ 环境校验

# 检查next.js的目录是否存在
if [ ! -d ".next" ]; then
  error "构建目录 .next/ 不存在，请先执行构建命令（如 npm run build）"
  exit 1
fi
if [ ! -f "ecosystem.config.js" ]; then
  error "PM2 配置文件 ecosystem.config.js 缺失"
  exit 1
fi

# ───────────────────────────────────────
# 2️⃣ 获取 PM2 命令（跨平台兼容）
pm2_cmd() {
    if command -v pm2 &> /dev/null; then
        pm2 "$@"
    elif command -v pm2.cmd &> /dev/null; then
        pm2.cmd "$@"
    elif [ -x "./node_modules/.bin/pm2" ]; then
        ./node_modules/.bin/pm2 "$@"
    elif [ -x "./node_modules/.bin/pm2.cmd" ]; then
        ./node_modules/.bin/pm2.cmd "$@"
    else
        npx pm2 "$@"
    fi
}

# 测试 PM2 是否可用
if ! pm2_cmd --version &> /dev/null; then
    error "PM2 不可用，请安装: npm install -g pm2"
    exit 1
fi

# 安装依赖
info "安装依赖..."
pnpm install

# ───────────────────────────────────────
# 3️⃣ 安全加载环境变量
load_env_vars() {
  local env_file=".env.${ENV}"
  if [ ! -f "$env_file" ]; then
    info "环境变量文件 $env_file 不存在，跳过加载"
    return 0
  fi

  log "加载环境变量: $env_file"
  while IFS= read -r line || [ -n "$line" ]; do
    [[ -z "$line" ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    
    key=$(echo "$line" | cut -d '=' -f 1 | xargs)
    value=$(echo "$line" | cut -d '=' -f 2- | xargs)
    
    if [[ "$key" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
      export "$key"="$value"
    else
      info "跳过非法变量名: $key"
    fi
  done < "$env_file"

  [ "$ENV" = "production" ] && export NODE_ENV=${NODE_ENV:-production}
}
load_env_vars

# ───────────────────────────────────────
# 4️⃣ 执行 Prisma 数据库迁移
execute_prisma_migrations() {
  info "🔄 执行 Prisma 数据库迁移..."
  
  if [ "$DRY_RUN" = true ]; then
    info "[DRY-RUN] 将执行: prisma生产环境迁移"
    return 0
  fi
  
  # 执行数据库迁移
  if ! pnpm prisma:migrate:prod; then
    error "Prisma 数据库迁移失败"
    exit 1
  fi
  
  # 生成 Prisma 客户端
  if ! pnpm prisma:generate; then
    error "Prisma 客户端生成失败"
    exit 1
  fi
  
  info "✅ Prisma 数据库迁移完成"
}
execute_prisma_migrations

# ───────────────────────────────────────
# 5️⃣ 定义 PM2 应用存在检查函数
pm2_app_exists() {
  pm2_cmd show "$APP_NAME" >/dev/null 2>&1
}

# ───────────────────────────────────────
# 6️⃣ 启动/重载应用
ACTION=""
if pm2_app_exists; then
  ACTION="reload"
  log "🔄 重新加载应用 ($ENV)"
else
  ACTION="start"
  log "🚀 启动新实例 ($ENV)"
fi

if [ "$DRY_RUN" = true ]; then
  info "[DRY-RUN] 将执行: pm2_cmd $ACTION ecosystem.config.js --env $ENV"
else
  if [ "$ACTION" = "reload" ]; then
    if ! pm2_cmd reload ecosystem.config.js --env "$ENV" --update-env; then
      error "PM2 重载失败，尝试回滚重启..."
      pm2_cmd restart "$APP_NAME" || true
      error "部署失败，已回滚"
      exit 1
    fi
  else
    if ! pm2_cmd start ecosystem.config.js --env "$ENV"; then
      error "PM2 启动失败"
      exit 1
    fi
  fi
fi

# ───────────────────────────────────────
# 7️⃣ 保存进程列表（用于开机自启）
if [ "$DRY_RUN" = false ]; then
  pm2_cmd save 2>/dev/null || true
fi

# ───────────────────────────────────────
# 8️⃣ 健康检查（简化版）
if [ "$DRY_RUN" = false ] && [ "$ACTION" = "start" ]; then
  log "⏳ 等待应用启动..."
  sleep 3

  # 获取端口
  get_app_port() {
    local port=${PORT:-3000}
    echo "$port"
  }

  PORT=$(get_app_port)
  info "检测到应用端口: $PORT"

  MAX_ATTEMPTS=8
  CHECK_INTERVAL=2
  HEALTH_CHECKED=false

  for i in $(seq 1 $MAX_ATTEMPTS); do
    info "健康检查 $i/$MAX_ATTEMPTS..."

    # 简单端口检查
    if command -v ss &>/dev/null && ss -tln 2>/dev/null | grep -q ":$PORT\b"; then
      info "✅ 端口 $PORT 正在监听"
      
      # HTTP 健康检查
      if command -v curl &>/dev/null && curl -sf --max-time 2 "http://localhost:${PORT}/api/health" &>/dev/null; then
        success "✅ HTTP 健康检查通过"
        HEALTH_CHECKED=true
        break
      fi
    elif command -v netstat &>/dev/null && netstat -an 2>/dev/null | grep -q ":$PORT.*LISTEN"; then
      info "✅ 端口 $PORT 正在监听 (netstat)"
      
      if command -v curl &>/dev/null && curl -sf --max-time 2 "http://localhost:${PORT}/api/health" &>/dev/null; then
        success "✅ HTTP 健康检查通过"
        HEALTH_CHECKED=true
        break
      fi
    fi

    sleep $CHECK_INTERVAL
  done

  if [ "$HEALTH_CHECKED" = false ]; then
    error "❌ 健康检查超时"
    echo ""
    info "最近的 PM2 日志:"
    pm2_cmd logs "$APP_NAME" --lines 20 --raw --no-stream 2>/dev/null || true
    exit 1
  fi
fi

# ───────────────────────────────────────
# 9️⃣ 部署结果输出
if [ "$DRY_RUN" = false ]; then
  success "✅ 部署成功！"
  
  # 显示当前状态
  echo ""
  echo "📊 当前 PM2 状态:"
  pm2_cmd list "$APP_NAME" 2>/dev/null || pm2_cmd list
  
  # 输出操作提示
  cat <<EOF

💡 操作提示：
   查看所有进程:      pm2 list
   查看应用状态:      pm2 show $APP_NAME
   查看实时日志:      pm2 logs $APP_NAME
   重启应用:          pm2 restart $APP_NAME
   停止应用:          pm2 stop $APP_NAME
   删除应用:          pm2 delete $APP_NAME
   保存状态:          pm2 save
   开机自启设置:      pm2 startup

📌 注意：PM2 数据默认保存在 ~/.pm2/
EOF

  if [ "$ENV" != "production" ]; then
    PORT=${PORT:-3000}
    info "测试访问: curl http://localhost:$PORT/api/health"
  fi
else
  success "[DRY-RUN] 模拟部署完成"
fi

exit 0