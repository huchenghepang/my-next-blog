"use client";

import { GetArticleCountDto } from "@/types";

interface CategoryFilterProps {
  categories: GetArticleCountDto[];
  selectedCategory: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  const totalCount = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <section className="mb-10 lg:mb-12 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          分类筛选
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {categories.length} 个分类 · {totalCount} 篇文章
        </span>
      </div>

      <div className="flex flex-wrap gap-2 lg:gap-3">
        {/* 全部按钮 */}
        <CategoryButton
          label="全部"
          count={totalCount}
          isActive={selectedCategory === null}
          onClick={() => onSelect(null)}
          gradient="from-amber-500 to-orange-500"
          hoverColor="amber"
          icon={<ListIcon />}
        />

        {/* 分类按钮 */}
        {categories.map((category) => (
          <CategoryButton
            key={category.category_id}
            label={category.name}
            count={category.count}
            isActive={selectedCategory === category.category_id}
            onClick={() => onSelect(category.category_id)}
            gradient="from-emerald-500 to-teal-500"
            hoverColor="emerald"
          />
        ))}
      </div>
    </section>
  );
}

// ========== 子组件：分类按钮 ==========
function CategoryButton({
  label,
  count,
  isActive,
  onClick,
  gradient,
  hoverColor,
  icon,
}: {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  gradient: string;
  hoverColor: "amber" | "emerald";
  icon?: React.ReactNode;
}) {
  const base =
    "group px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border-2 relative overflow-hidden";
  const active = `bg-gradient-to-r ${gradient} text-white border-transparent shadow-lg shadow-${hoverColor}-500/25 dark:shadow-${hoverColor}-500/15`;
  const inactive =
    "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-${hoverColor}-400 dark:hover:border-${hoverColor}-500 hover:text-${hoverColor}-600 dark:hover:text-${hoverColor}-400";

  return (
    <button
      onClick={onClick}
      className={`${base} ${isActive ? active : inactive}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
        {count !== undefined && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-${hoverColor}-100 dark:group-hover:bg-${hoverColor}-900/30 group-hover:text-${hoverColor}-600 dark:group-hover:text-${hoverColor}-400"
            }`}
          >
            {count}
          </span>
        )}
      </span>
    </button>
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
