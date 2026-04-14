export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-slate-700" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16" />
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
