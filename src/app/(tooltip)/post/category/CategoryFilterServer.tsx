import { GetArticleCountDto } from "@/types";
import Link from "next/link";

interface CategoryFilterProps {
  categories: GetArticleCountDto[];
  selectedCategory: number | null;
}

export default function CategoryFilterServer({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const totalCount = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <section className="mb-10 lg:mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          分类筛选
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {categories.length} 个分类 · {totalCount} 篇文章
        </span>
      </div>

      <div className="flex flex-wrap gap-2 lg:gap-3">
        {/* 全部链接 */}
        <CategoryLink
          label="全部"
          count={totalCount}
          isActive={selectedCategory === null}
          href="/post/category" // 或者你需要的全部文章路径
          gradient="from-amber-500 to-orange-500"
          hoverColor="amber"
          icon={<ListIcon />}
        />

        {/* 分类链接 - 使用 slug */}
        {categories.map((category) => (
          <CategoryLink
            key={category.category_id}
            label={category.name}
            count={category.count}
            isActive={selectedCategory === category.category_id}
            href={`/post/category/${category.slug}`} // 使用 slug 构建 URL
            gradient="from-emerald-500 to-teal-500"
            hoverColor="emerald"
          />
        ))}
      </div>
    </section>
  );
}

// ========== 子组件：分类链接 ==========
// ========== 子组件：分类链接 ==========
function CategoryLink({
  label,
  count,
  isActive,
  href,
  gradient,
  hoverColor,
  icon,
}: {
  label: string;
  count?: number;
  isActive: boolean;
  href: string;
  gradient: string;
  hoverColor: "amber" | "emerald";
  icon?: React.ReactNode;
}) {
  const activeStyles = `bg-gradient-to-r ${gradient} text-white border-transparent shadow-lg ${
    hoverColor === "amber"
      ? "shadow-amber-500/25 dark:shadow-amber-500/15"
      : "shadow-emerald-500/25 dark:shadow-emerald-500/15"
  }`;

  const inactiveStyles = `bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 ${
    hoverColor === "amber"
      ? "hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
      : "hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
  }`;

  const countStyles = (isActive: boolean, hoverColor: "amber" | "emerald") => {
    if (isActive) {
      return "bg-white/20 text-white";
    }
    return `bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 ${
      hoverColor === "amber"
        ? "group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 group-hover:text-amber-600 dark:group-hover:text-amber-400"
        : "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
    }`;
  };

  return (
    <Link
      href={href}
      className={`
        group px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 
        border-2 relative overflow-hidden
        ${isActive ? activeStyles : inactiveStyles}
      `}
      scroll={false}
      aria-label={`${label} 分类，共 ${count} 篇文章`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center gap-2">
        {icon}

        {/* SEO 优化：分类名称用语义化标签 */}
        <span className="font-semibold" itemProp="name">
          {label}
        </span>

        {/* SEO 优化：数量用语义化标签，并添加说明文字 */}
        {count !== undefined && (
          <>
            <span className="sr-only">共</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${countStyles(isActive, hoverColor)}`}
              itemProp="numberOfItems"
            >
              {count}
            </span>
            <span className="sr-only">篇文章</span>
          </>
        )}
      </span>
    </Link>
  );
}

function ListIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}
