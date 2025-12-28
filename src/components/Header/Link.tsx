import Link from "next/link";
import React from "react";

interface LinkProps {
  linkText: string;
  href?: string;
}

const LinkHeader: React.FC<LinkProps> = ({ linkText, href }) => {
  return (
    <li className="flex hover:bg-slate-500 hover:text-cyan-50">
      <Link
        rel="noopener noreferrer"
        href={href || "/"}
        className="flex items-center px-4 -mb-1 border-b-2 border-transparent hover:border-cyan-200 dark:text-white dark:hover:border-violet-600"
      >
        {linkText}
      </Link>
    </li>
  );
};

export default LinkHeader;
