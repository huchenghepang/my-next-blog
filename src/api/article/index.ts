import {
  Article,
  ArticleListRequest,
  GetArticleCountDto,
  LatestArticleDto,
  PaginationResponse,
} from "@/types";
import { clientAPI } from "../client";
// 定义 TOC 项的类型 (对应 #/definitions/240420050)

/**
 * 获取公开文章列表
 */
export const getPublicArticles = async (
  data: ArticleListRequest,
): Promise<PaginationResponse<Article>> => {
  return clientAPI.get("/api/article", { params: data });
};

/**
 * 获取分类下面的文章数据信息
 */
export const getArticleCountByCategory = async (): Promise<
  PaginationResponse<GetArticleCountDto>
> => {
  return clientAPI.get(`/api/article-category/count`);
};


/**
 * 获取文章的详情
 */
export const getArticleDetailBySlug = async (
  slug: string,
): Promise<Article> => {
  return clientAPI.get(`/api/article/slug/${slug}`);
};


/**
 * 获取最新的公开文章
 */
export const getLatestPublicArticle = async (): Promise<LatestArticleDto> => {
  return clientAPI.get("/api/article/latest");
};


/**
 * 获取文章的分类数据
 */
export const getArticleCategoryData = async (): Promise<
  PaginationResponse<GetArticleCountDto>
> => {
  return clientAPI.get("/api/article-category/count");
};


/**
 * 获取文章的分类
 */
export const getArticleCategoryList = async (): Promise<
  PaginationResponse<GetArticleCountDto>
> => {
  return clientAPI.get("/api/article-category/count");
};

  