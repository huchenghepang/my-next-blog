"use client";

import { Article, GetArticleCountDto } from "@/types";
import Image from "next/image";

interface ArticleCardProps {
  article: Article;
  categories?: GetArticleCountDto[];
  index?: number; // 用于动画延迟
}

export default function ArticleCard({
  article,
  categories,
  index = 0,
}: ArticleCardProps) {
  const category = categories?.find(
    (c) => c.category_id === article.category_id,
  );

  return (
    <article
      className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 缩略图 */}
      {article.thumbnail && (
        <a
          href={`/post/${article.slug}`}
          className="block relative overflow-hidden"
        >
          <div className="relative w-full h-48">
            <Image
              src={article.thumbnail}
              alt={article.title || "文章缩略图"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              quality={80}
              unoptimized
            />
          </div>

          {/* 遮罩层保持不变 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* 分类标签保持不变 */}
          {category && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-blue-600 dark:text-blue-400 shadow-sm z-10">
              {category.name}
            </span>
          )}
        </a>
      )}

      {/* 内容 */}
      <div className={`p-5 ${!article.thumbnail ? "pt-4" : ""}`}>
        {/* 元信息 */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          {article.published_at && (
            <span className="flex items-center gap-1">
              <CalendarIcon />
              {new Date(article.published_at).toLocaleDateString("zh-CN", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <EyeIcon />
            {article.reading || 0} 阅读
          </span>
          <span className="flex items-center gap-1">
            <CommentIcon />
            {article.comment_count || 0} 评论
          </span>
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <a
            href={`/post/${article.slug}`}
            className="hover:underline decoration-blue-200 dark:decoration-blue-800 underline-offset-2"
          >
            {article.title}
          </a>
        </h3>

        {/* 描述 */}
        {article.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
            {article.description}
          </p>
        )}

        {/* 底部 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
          <a
            href={`/post/${article.slug}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group/link"
          >
            阅读
            <svg
              className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

// 图标组件
function CalendarIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}
