export interface ArticleListRequest {
  /**
   * 文章分類ID
   */
  category_id?: number;
  /**
   * 文章是否已归档
   */
  is_archive?: boolean;
  /**
   * 文章是否為外部鏈接 是外部文章
   */
  is_external?: boolean;
  /**
   * 文章是否為首頁特推
   */
  is_featured?: boolean;
  /**
   * 文章是否為首頁熱門
   */
  is_hot?: boolean;
  /**
   * 文章是否已發布
   */
  is_published?: boolean;
  /**
   * 文章是否為首頁頂部
   */
  is_top?: boolean;
  page: number;
  pageSize: number;
  slug?: string;
  /**
   * 文章標題
   */
  title?: string;
  [property: string]: any;
}
