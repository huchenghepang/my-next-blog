import { FC } from "react";
import ArticleCard from "./ArticleCard";
import DownArrowWrapper from "./DownArrowWrapper";

interface ArticlesListProps {
  // 这里是组件的属性
  articleList: any;
}

// 根据文件名生成组件
const ArticlesList: FC<ArticlesListProps> = ({ articleList }) => {
  return (
    <section className="py-6 sm:py-12  ">
      <div className="container p-6 mx-auto space-y-8">
        <div className="space-y-2 text-center ">
          <h2 className="text-2xl  font-bold">
            <span>有些东西总需要瞅瞅的 &nbsp;&nbsp;</span>
            <DownArrowWrapper></DownArrowWrapper>
          </h2>
          <p id="step-second-life" className="font-serif text-sm ">
            不知道看什么？这里有些东西我可以分享给你...
          </p>
        </div>
        <div
          id="articlesList-recommend"
          className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {articleList?.map((article: any) => {
            return <ArticleCard key={article.id} {...article}></ArticleCard>;
          })}
        </div>
      </div>
    </section>
  );
};

export const revalidate = 86400;

export default ArticlesList;
