#!/bin/bash
# save-and-set-env-secrets.sh （修正版）

ENV_FILES=(
  ".env"
  ".env.production"
)

for file in "${ENV_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    # 生成 Secret 名
    if [[ "$file" == ".env" ]]; then
      secret_name="ENV_COMMON"
    else
      secret_name="ENV$(echo "$file" | sed 's/\.env\.//; s/\./_/g' | tr '[:lower:]' '[:upper:]')"
    fi

    echo "✅ 设置 Secret: $secret_name"
    
    # 🔑 关键修正：先 base64 编码，再上传！
    # 使用 -w0（Linux）或 -b0（macOS）禁用自动换行
    if command -v base64 >/dev/null 2>&1; then
      if base64 --help 2>&1 | grep -q "wrap"; then
        # Linux (GNU coreutils)
        encoded=$(base64 -w0 "$file")
      else
        # macOS / BSD
        encoded=$(base64 -b0 "$file" 2>/dev/null || base64 "$file" | tr -d '\n')
      fi
    else
      echo "❌ base64 命令不可用，请安装 coreutils"
      exit 1
    fi

    # 上传 base64 字符串
    echo "$encoded" | gh secret set "$secret_name"

    echo "   → 文件: $file"
    echo "   → 原始长度: $(wc -c < "$file") 字节"
    echo "   → Base64 长度: ${#encoded} 字符"
    echo ""
  fi
done