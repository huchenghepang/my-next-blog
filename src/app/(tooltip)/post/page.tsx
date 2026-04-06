import ArticleCard from "@/components/ArticleList/article-card";

export default function ArticleList() {
  return (
    <div>
      <ArticleCard
        id="1"
        title="文章标题"
        excerpt="文章摘要"
        date="2023-08-15"
        author={{ name: "作者姓名" }}
      />
    </div>
  );
}
