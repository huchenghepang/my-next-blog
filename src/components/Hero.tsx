"use client";
import { useTypewriter } from "react-simple-typewriter";

const HeroSection = () => {
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
    <section className="relative max-w-5xl mx-auto py-12 px-4 text-center">
      <div className="h-screen w-full bg-[url('/webp/167387.webp')] dark:rounded-full dark:bg-[url('/webp/20230505529l83.webp')] bg-cover bg-fixed bg-center"></div>

      <div>
        <div className="container flex flex-col items-center px-4 py-16 pb-24 mx-auto text-center lg:pb-56 md:py-32 md:px-10 lg:px-32 ">
          {/* 预留固定的高度，避免高度跳变 */}
          <h2 className="text-5xl font-bold leading-none sm:text-6xl xl:max-w-3xl dark:text-gray-50 min-h-[72px]">
            <div className="h-1 w-full  bg-fixed  rounded-3xl bg-cover bg-center bg-gradient-to-t from-yellow-300/50 to-transparent"></div>
            <span className="inline-block min-w-[250px]">{text}</span>
            <div className="h-1 w-full  bg-fixed  rounded-3xl bg-cover bg-center bg-gradient-to-t from-yellow-300/50 to-slate-500"></div>
          </h2>
          <p className="mt-6 mb-8 text-lg sm:mb-12 xl:max-w-3xl dark:text-gray-50">
            无论如何，希望你我，毫无疑问，活的幸福！
          </p>

          <div className="flex flex-wrap justify-center">
            <button
              type="button"
              className="px-8 z-20 py-3 m-2 text-lg border-sky-300 bg-sky-600 text-white hover:bg-slate-500 dark:hover:bg-slate-400 hover:text-sky-300 font-semibold rounded dark:bg-gray-100 dark:text-gray-900"
            >
              最新 文章
            </button>
            <button
              type="button"
              className="px-8 z-20 py-3 m-2 text-lg border rounded bg-yellow-100 text-slate-600 hover:bg-slate-500 hover:text-white bold font-semibold dark:border-gray-300 "
            >
              了解 更多
            </button>
          </div>
        </div>
      </div>

      <div className="absolute z-10 bottom-0 left-0 w-full h-4/6 rounded-3xl bg-cover bg-center bg-gradient-to-t from-orange-300/50 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
