import SlideInCss from "@/components/Animation/SlideInCss";
import EmptyState from "@/components/UI/EmptyState";
import { Article, GetArticleCountDto } from "@/types";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  categories?: GetArticleCountDto[];
}

export default function ArticleGrid({
  articles,
  categories,
}: ArticleGridProps) {
  if (!articles || articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
      {articles.map((article, index) => (
        <SlideInCss
          direction="up"
          key={article.id || article.public_id}
          delay={index * 0.2}
        >
          <ArticleCard
            article={article}
            categories={categories}
            index={index}
          />
        </SlideInCss>
      ))}
    </div>
  );
}
