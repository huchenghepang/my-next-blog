"use client";
import MyEditor from "@/components/MyEditor/MyEditor";
import { useEffect, useState } from "react";

// 根据文件名生成组件
const Page = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleString("zh-CN"));
  }, []);
  return (
    <div>
      <div className="flex justify-center items-center ">
        <h2 className="text-3xl font-bold text-gray-900">📝 编辑文章</h2>
      </div>
      <p className="text-sm flex justify-between text-gray-500 mt-1">
        在这里撰写、编辑和管理你的文章
        <span className="text-sm text-gray-500">{currentTime}</span>
      </p>
      <MyEditor></MyEditor>
    </div>
  );
};

export default Page;
