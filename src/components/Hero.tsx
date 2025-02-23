"use client";
import { useTypewriter } from "react-simple-typewriter";

const HeroSection = () => {
  const [text] = useTypewriter({
    words: [
      "你好！我是",
      "一名前端开发者",
      "热衷于技术分享和博客创作",
    ],
    loop: 0, // 无限循环
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 1000,
  });

  return (
    <section className="max-w-5xl mx-auto py-12 px-4 text-center">
      <div className="dark:bg-violet-600">
        <div className="container flex flex-col items-center px-4 py-16 pb-24 mx-auto text-center lg:pb-56 md:py-32 md:px-10 lg:px-32 dark:text-gray-50">
          {/* 预留固定的高度，避免高度跳变 */}
          <h2 className="text-5xl font-bold leading-none sm:text-6xl xl:max-w-3xl dark:text-gray-50 min-h-[72px]">
            <span className="inline-block min-w-[250px]">{text}</span>
          </h2>
          <p className="mt-6 mb-8 text-lg sm:mb-12 xl:max-w-3xl dark:text-gray-50">
            希望你能在这里找到有用的内容！
          </p>
          <div className="flex flex-wrap justify-center">
            <button
              type="button"
              className="px-8 py-3 m-2 text-lg font-semibold rounded dark:bg-gray-100 dark:text-gray-900"
            >
              最新 文章
            </button>
            <button
              type="button"
              className="px-8 py-3 m-2 text-lg border rounded dark:border-gray-300 dark:text-gray-50"
            >
              了解 更多
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
