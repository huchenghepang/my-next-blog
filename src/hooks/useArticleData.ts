"use client";

import {
  getArticleCategoryDataProxy,
  getPublicArticlesProxy,
} from "@/api/article/proxy-article";
import { Article, ArticleListRequest, GetArticleCountDto } from "@/types";
import { useEffect, useState } from "react";

interface UseArticleDataReturn {
  categories: GetArticleCountDto[];
  articles: Article[];
  selectedCategory: number | null;
  loading: boolean;
  error: string | null;
  setSelectedCategory: (id: number | null) => void;
  refresh: () => void;
}

export function useArticleData(): UseArticleDataReturn {
  const [categories, setCategories] = useState<GetArticleCountDto[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取分类
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const res = await getArticleCategoryDataProxy();
        if (mounted) setCategories(res.items || []);
      } catch (err) {
        if (mounted) {
          setError("获取分类失败");
          console.error(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  // 获取文章
  useEffect(() => {
    let mounted = true;
    const fetchArticles = async () => {
      if (!selectedCategory) {
        const res = await getPublicArticlesProxy({
          is_published: true,
          page: 1,
          pageSize: 12,
        });
        if (mounted) setArticles(res.items || []);
        return;
      }
      try {
        setLoading(true);
        const params: ArticleListRequest = {
          category_id: selectedCategory,
          is_published: true,
          page: 1,
          pageSize: 12,
        };
        const res = await getPublicArticlesProxy(params);
        if (mounted) setArticles(res.items || []);
      } catch (err) {
        if (mounted) {
          setError("获取文章失败");
          console.error(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchArticles();
    return () => {
      mounted = false;
    };
  }, [selectedCategory]);

  const refresh = () => {
    setSelectedCategory(null);
    setArticles([]);
  };

  return {
    categories,
    articles,
    selectedCategory,
    loading,
    error,
    setSelectedCategory,
    refresh,
  };
}
