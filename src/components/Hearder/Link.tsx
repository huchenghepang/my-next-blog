import React from "react";

// 定义组件的 Props 类型
interface LinkProps {
  // 这里是组件的属性
  linkText:string;
  href?:string;
}

// 根据文件名生成组件
const LinkHeader: React.FC<LinkProps> = ({ linkText, href }) => {
  return (
    <li className="flex hover:bg-slate-500 hover:text-cyan-50">
      <a
        rel="noopener noreferrer"
        href={href || "/"}
        className="flex items-center px-4 -mb-1 border-b-2 border-transparent hover:border-cyan-200 dark:text-white dark:hover:border-violet-600"
      >
        {linkText}
      </a>
    </li>
  );
};

export default LinkHeader;
