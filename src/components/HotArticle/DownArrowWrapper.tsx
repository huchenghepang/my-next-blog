"use client";
import { FC, useCallback } from "react";
import { BiDownArrow } from "react-icons/bi";

interface DownArrowWrapperProps {
  /** 跳转的目标元素的id选择器 */
  idTarget?: string;
  block?: ScrollLogicalPosition;
}

// 根据文件名生成组件
const DownArrowWrapper: FC<DownArrowWrapperProps> = ({ idTarget, block }) => {
  const scrollIntoView = useCallback(
    (id: string | undefined, block?: ScrollLogicalPosition) => {
      const target = document.getElementById(id || "articlesList-recommend");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: block || "start" });
      }
    },
    []
  );

  return (
    <BiDownArrow
      size={28}
      className="inline"
      onClick={() => scrollIntoView(idTarget, block)}
    ></BiDownArrow>
  );
};

export default DownArrowWrapper;
