"use client";

import { Pagination, PaginationItem } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  siblingCount?: number;
  boundaryCount?: number;
  basePath?: string;
  categorySlug?: string;
}

export default function PaginationServer({
  total,
  page,
  pageSize,
  siblingCount = 1,
  boundaryCount = 1,
  basePath,
  categorySlug,
}: PaginationProps) {
  const pathname = usePathname();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const createPageUrl = (targetPage: number) => {
    const path = categorySlug
      ? `${basePath || pathname}`
      : basePath || pathname;

    const search = new URLSearchParams({
      page: targetPage.toString(),
      pageSize: pageSize.toString(),
    }).toString();

    return `${path}?${search}`;
  };

  return (
    <nav className="flex justify-center mt-10 lg:mt-12" aria-label="文章分页">
      <Pagination
        count={totalPages}
        page={page}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        showFirstButton
        showLastButton
        color="primary"
        size="medium"
        renderItem={(item: any) => (
          <PaginationItem
            component={Link}
            href={createPageUrl(item.page as number)}
            {...item}
            // 滚动行为：翻页后回到顶部（可配置）
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            // Tailwind + MUI 样式融合
            className="
              [&.Mui-selected]:bg-gradient-to-r [&.Mui-selected]:from-blue-500 [&.Mui-selected]:to-indigo-500
              [&.Mui-selected]:text-white [&.Mui-selected]:font-semibold
              dark:[&.Mui-selected]:from-blue-600 dark:[&.Mui-selected]:to-indigo-600
              rounded-lg mx-0.5 min-w-[36px] h-9
              hover:bg-gray-100 dark:hover:bg-slate-700
              transition-all duration-200
            "
            classes={{
              disabled: "opacity-40 cursor-not-allowed hover:bg-transparent",
            }}
            // 无障碍优化
            aria-label={
              item.type === "page"
                ? `第 ${item.page} 页`
                : item.type === "first"
                  ? "第一页"
                  : item.type === "last"
                    ? "最后一页"
                    : item.type === "next"
                      ? "下一页"
                      : "上一页"
            }
          />
        )}
      />
    </nav>
  );
}
