import {
  Article,
  ArticleListRequest,
  GetArticleCountDto,
  PaginationResponse,
} from "@/types";
import { proxyClient } from "../client";

/**
 * 获取公开文章列表
 */
export const getPublicArticlesProxy = async (
  data: ArticleListRequest,
): Promise<PaginationResponse<Article>> => {
  return proxyClient.get("/api/article", { params: data });
};

/**
 * 获取文章的分类数据
 */
export const getArticleCategoryDataProxy = async (): Promise<
  PaginationResponse<GetArticleCountDto>
> => {
  return proxyClient.get("/api/article-category/count");
};
