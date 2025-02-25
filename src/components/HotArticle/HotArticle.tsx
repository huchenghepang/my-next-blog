"use client";
import { ArtcileRecommend } from "@/app/api/article/recommend/route";
import { fetcherClientCnm } from "@/utils/fetcher/fetcherCnm";
import { formatDateUTC } from "@/utils/format/formatDatetime";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { BiDownArrow } from "react-icons/bi";
import ArticleCard, { ArticleCardProps } from "./ArticleCard";
// 定义组件的 Props 类型


// 根据文件名生成组件
const HotArticlle: React.FC = () => {
  const hotArticle = useRef<HTMLDivElement | null>(null);
  const ScrollToViewTarget: MouseEventHandler<SVGAElement> = (event) => {
    if (hotArticle.current) {
      hotArticle.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [artcileList, setArticleList] = useState<ArticleCardProps[]>();

  useEffect(() => {
    fetcherClientCnm<ArtcileRecommend[]>("/api/article/recommend", {
      method: "GET",
    })
      .then(({ body }) => {
        if (body && body.data) {
          const data: ArticleCardProps[] = body.data.map((article) => {
            return {
              datetime: formatDateUTC(article.create_time.toString()).split(
                " "
              )[0],
              id: article.id+'',
              summary: article.summary || "",
              views: article.reading,
              title: article.name,
              href: `/posts/${article.id}`,
            };
          });
          setArticleList(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="py-6 sm:py-12  ">
      <div className="container p-6 mx-auto space-y-8">
        <div className="space-y-2 text-center ">
          <h2 className="text-2xl  font-bold">
            <span>生命中有些东西总需要瞅瞅的 &nbsp;&nbsp;</span>
            <BiDownArrow
              className="inline-block"
              onClick={ScrollToViewTarget}
            ></BiDownArrow>
          </h2>
          <p className="font-serif text-sm ">
            不知道看什么？这里有些东西我可以分享给你...
          </p>
        </div>
        <div
          ref={hotArticle}
          className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {artcileList?.map((article) => {
            return <ArticleCard key={article.id} {...article}></ArticleCard>;
          })}
        </div>
      </div>
    </section>
  );
};

export default HotArticlle;
