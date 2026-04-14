"use client";

import EmptyState from "@/components/UI/EmptyState";
import ErrorState from "@/components/UI/ErrorState";
import SkeletonCard from "@/components/UI/SkeletonCard";
import { Article } from "@/types";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  categories?: any[]; // GetArticleCountDto[]
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export default function ArticleGrid({
  articles,
  categories,
  loading,
  error,
  onRetry,
}: ArticleGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <ArticleCard
          key={article.id || article.public_id}
          article={article}
          categories={categories}
          index={index}
        />
      ))}
    </div>
  );
}
