"use client";
import { FC } from "react";
import { BiDownArrow } from "react-icons/bi";

function scrollIntoView(id: string | undefined, block?: ScrollLogicalPosition) {
  const target = document.getElementById(id || "articlesList-recommend");
  if (target) {
    console.log("存在");
    target.scrollIntoView({ behavior: "smooth", block: block || "start" });
  }
}

interface DownArrowWarpperProps {
  idTarget?: string;
  block?: ScrollLogicalPosition;
}

// 根据文件名生成组件
const DownArrowWarpper: FC<DownArrowWarpperProps> = ({ idTarget, block }) => {
  return (
    <BiDownArrow
      className="inline-block"
      onClick={() => scrollIntoView(idTarget, block)}
    ></BiDownArrow>
  );
};

export default DownArrowWarpper;
