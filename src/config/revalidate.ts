// 定义一个常见的 revalidate 枚举常量
export const Revalidate = {
  /** 数据几乎实时更新，常用于评论列表、通知等 0-立即更新 */
  REALTIME: 0,
  /** 短时间缓存，例如用户操作后的临时状态 60-1分钟 */
  SHORT: 60,
  /** 中等时长，例如产品分类列表、文章列表 3600-1小时 */
  MEDIUM: 3600,
  /** 长时间缓存，例如不常变化的配置、SEO 关键词 86400-24小时 */
  LONG: 86400,
  /** 极长时间，例如全局站点配置、法律条款等 604800-7天 */
  ETERNAL: 604800,
  /** 无限期缓存，直到主动调用 revalidateTag/Path 更新 */
  INFINITE: false, // 或直接省略该属性
} as const;

export const CacheKey = {
  /**
   * 首页
   */
  HOME: {
    HOME: "home",
    CATEGORY_COUNT_DATA: "category_count_data",
    ARTICLES: "home-articles",
  },
  /**
   * 文章
   */
  ARTICLE: {
    LATEST_ARTICLE: "post_latest_article",
  },
};
