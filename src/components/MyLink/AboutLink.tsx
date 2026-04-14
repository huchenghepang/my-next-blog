import Link from "next/link";

export const AboutLink = () => (
  <Link
    href="/post/category"
    className="px-8 py-3 m-2 text-lg border rounded bg-yellow-100 text-slate-600 hover:bg-slate-500 hover:text-white bold font-semibold dark:border-gray-300"
  >
    了解 更多
  </Link>
);
