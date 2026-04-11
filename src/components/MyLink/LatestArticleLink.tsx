import Link from "next/link";

export const LatestArticleLink = ({ slug }: { slug: string }) => (
  <Link
    href={slug}
    className="px-8 py-3 m-2  text-lg border-sky-300 bg-sky-600 text-white hover:bg-slate-500 dark:hover:bg-slate-400 hover:text-sky-300 font-semibold rounded dark:bg-gray-100 dark:text-gray-900"
  >
    最新 文章
  </Link>
);
