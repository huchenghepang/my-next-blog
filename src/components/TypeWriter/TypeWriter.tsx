"use client"
import { useTypewriter } from 'react-simple-typewriter';


// 根据文件名生成组件
const TypeWriter = () => {
      const [text] = useTypewriter({
        words: [
          "你好！我是",
          "一名开发者",
          "有时候我在想",
          "是不是越长大",
          "就越没有对生活的想象力？",
        ],
        loop: 0, // 无限循环
        typeSpeed: 80,
        deleteSpeed: 50,
        delaySpeed: 1000,
      });
  return (
    <h2 className="text-5xl font-bold leading-none sm:text-6xl xl:max-w-3xl dark:text-gray-50 min-h-[72px]">
      <div className="h-1 w-full  bg-fixed  rounded-3xl bg-cover bg-center bg-gradient-to-t from-yellow-300/50 to-transparent"></div>
      <span className="inline-block min-w-[250px]">{text}</span>
      <div className="h-1 w-full  bg-fixed  rounded-3xl bg-cover bg-center bg-gradient-to-t from-yellow-300/50 to-slate-500"></div>
    </h2>
  );
};

export default TypeWriter;