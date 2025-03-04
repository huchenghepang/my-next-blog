"use client";
import Silky from "@/utils/silky";
import { FC, useEffect } from "react";

// 根据文件名生成组件
const SlipDamping: FC = () => {
  useEffect(() => {
    const silky = new Silky();
    function raf(time: number) {
      silky.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);
  return (
    <></>
  );
};

export default SlipDamping;
