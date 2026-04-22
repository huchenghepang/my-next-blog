// lib/cache-strategy.ts

export interface CacheStrategyOptions {
  baseTime?: number;
  maxTime?: number;
  minTime?: number;
  jitterRange?: number;
}

export class CacheStrategy {
  /**
   * 通用缓存时间计算
   */
  static getRevalidateTime(
    params: Record<string, any>,
    options: CacheStrategyOptions = {},
  ): number {
    const {
      baseTime = 3600,
      maxTime = 86400,
      minTime = 60,
      jitterRange = 300,
    } = options;

    // 基础时间
    let time = baseTime;

    // 根据参数调整（可选）
    if (params.page && typeof params.page === "number") {
      time += Math.min(params.page * 60, 3600);
    }

    if (params.categoryId && typeof params.categoryId === "number") {
      time += Math.min(Math.floor(params.categoryId / 10) * 60, 7200);
    }

    // 添加抖动
    if (jitterRange > 0) {
      const jitter = Math.floor(Math.random() * jitterRange);
      time += jitter;
    }

    // 限制范围并确保返回有效数字
    const result = Math.floor(Math.max(minTime, Math.min(maxTime, time)));

    // 最终安全检查
    if (isNaN(result) || !isFinite(result)) {
      return 3600;
    }

    return result;
  }

  /**
   * 列表类型缓存策略
   */
  static forList(
    params: Record<string, any>,
    options?: CacheStrategyOptions,
  ): number {
    return this.getRevalidateTime(params, {
      baseTime: 3600,
      jitterRange: 600,
      ...options,
    });
  }

  /**
   * 详情类型缓存策略
   */
  static forDetail(
    params: Record<string, any>,
    options?: CacheStrategyOptions,
  ): number {
    return this.getRevalidateTime(params, {
      baseTime: 7200,
      jitterRange: 300,
      ...options,
    });
  }
}
