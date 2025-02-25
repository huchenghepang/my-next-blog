"use client";
import { formatNumber } from "@/utils/noraml/formatNumber";
import { FC } from "react";

// 定义组件的 Props 类型
export interface ArticleCardProps {
  id?:string;  
  title: string;
  summary: string;
  datetime: string;
  views: number;
  href?:string
}

// 根据文件名生成组件
const ArticleCard: FC<ArticleCardProps> = ({
  title,
  summary,
  datetime,
  views,
  href,
  id,
}) => {
  return (
    <article
      id={id}
      className="flex relative flex-col text-stone-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-900 backdrop-blur-md p-6 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:backdrop-blur-lg hover:shadow-xl"
    >
      <a
        rel="noopener noreferrer"
        href={href + "/"}
        aria-label="Te nulla oportere reprimique his dolorum"
      ></a>
      <div className="flex flex-col flex-1">
        <a
          rel="noopener noreferrer"
          href={href + "/"}
          aria-label="Te nulla oportere reprimique his dolorum"
        ></a>
        <a
          rel="noopener noreferrer"
          href={href + "/"}
          className="z-20 text-xs tracking-wider uppercase hover:underline text-stone-200 dark:text-gray-100"
        >
          {title} 
        </a>
        <h3 className="flex-1 py-2 text-lg text-stone-200 font-semibold leading-snug  dark:text-gray-100">
          {summary}
        </h3>
        <div className="flex flex-wrap text-stone-200 justify-between pt-3 space-x-2 text-xs  dark:text-gray-400">
          <span>{datetime}</span>
          <span>{formatNumber(views)}</span>
        </div>
        <div className={`z-0 absolute bottom-3 right-2 left-3 w-full h-full bg-cover bg-center bg-gradient-to-t from-yellow-400/25 to-transparent1`}></div>
      </div>
    </article>
  );
};

export default ArticleCard;
