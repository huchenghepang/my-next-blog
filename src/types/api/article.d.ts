/**
 * GetArticleCountDto
 */
export interface GetArticleCountDto {
  category_id: number;
  count: number;
  name: string;
  slug: string;
}
export interface TocItem {
  // 根据实际结构补充字段，例如：
  title: string;
  anchor: string;
  level?: number;
  [key: string]: any;
}

// 定义标签项的类型 (对应 #/definitions/240420051)
export interface TagItem {
  id: number;
  name: string;
  slug: string;
}

// 定义文章分类详情的类型 (对应 #/definitions/240420053)
export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
}

// 定义用户（创建者/编辑者）的类型 (对应 #/definitions/240420054)
export interface User {
  userId: string;
  userName: string;
  headImgUrl?: string;
}

// 定义文章标签关联的类型 (对应 #/definitions/240420055)
export interface ArticlesTag {
  // 根据实际结构补充字段，例如：
  name: string;
  slug?: string;
}

// 定义文章的主要类型
export interface Article {
  /** 文章ID 公開的id */
  public_id?: string;
  /** 文章標題 */
  title: string;
  slug: string;
  description?: string;
  content?: string;
  /** 文章分類ID */
  category_id?: number;
  /** 文章目錄 */
  toc?: TocItem[];
  /** 文章閱讀量 */
  reading?: number;
  /** 文章評論量 */
  comment_count?: number;
  /** 文章是否已归档 */
  is_archive?: boolean;
  /** 文章是否為首頁特推 */
  is_featured?: boolean;
  /** 文章是否為首頁熱門 */
  is_hot?: boolean;
  /** 文章是否為首頁頂部 */
  is_top?: boolean;
  /** 文章是否已發布 */
  is_published?: boolean;
  /** 文章SEO標題 */
  seo_title?: string;
  /** 文章SEO描述 */
  seo_description?: string;
  /** 文章SEO關鍵字 */
  seo_keywords?: string;
  /** 文章發布時間 */
  published_at?: string;
  /** 文章更新時間 */
  updated_at?: string;
  /** 文章是否為外部鏈接 是外部文章 */
  is_external?: boolean;
  /** 外部文章鏈接 */
  external_url?: string;
  /** 外部文章作者 */
  external_author?: string;
  thumbnail?: string;
  /** 標籤 */
  tags?: TagItem[];
  /** 文章的类型 */
  content_type?: "richtext" | "markdown";
  id: string;
  /** 文章的创建时间 */
  created_at?: string;
  /** 文章分类的详情 */
  article_categories?: ArticleCategory;
  /** 文章的创建者 */
  creator?: User | null;
  /** 文章的编辑者 */
  editor?: User | null;
  /** 文章的标签 */
  articles_tags?: ArticlesTag[];
}

export interface LatestArticleDto {
  public_id: string;
  title: string;
  slug: string;
}




/**
 * GetArticleCountDto
 */
export interface GetArticleCountDto {
  category_id: number;
  count: number;
  name: string;
  slug: string;
}

/**
 * CategoryResponseDto
 */
export interface CategoryResponseDto {
    /**
     * 创建时间
     */
    created_at: Date;
    /**
     * 分类ID
     */
    id: number;
    level: number;
    name: string;
    /**
     * 父分类ID
     */
    parent_id?: number | null;
    /**
     * 分类路径
     */
    slug?: null | string;
    /**
     * 更新时间
     */
    updated_at: Date;
}

