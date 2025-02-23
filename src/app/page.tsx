import Button from "@/components/Button/Button";
import HeroSection from "@/components/Hero";
import Image from "next/image";

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 头部横幅 */}
      <header className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">欢迎来到天空之城博客</h1>
        <p className="text-lg mt-4">
          从技术到生活，再至人生的思考，都将慢慢述说道来...
        </p>
      </header>
      <header className="p-4 sticky top-0 z-50 bg-neutral-50 dark:bg-gray-100 dark:text-gray-800 ">
        <div className="container flex justify-between h-16 mx-auto">
          <ul className="items-stretch hidden space-x-3 lg:flex">
            <li className="flex">
              <a
                rel="noopener noreferrer"
                href="/about"
                className="flex items-center px-4 -mb-1 border-b-2 dark:border- dark:text-violet-600 dark:border-violet-600"
              >
                关于
              </a>
            </li>
            <li className="flex">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center px-4 -mb-1 border-b-2 dark:border-"
              >
                文章
              </a>
            </li>
            <li className="flex">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex  items-center px-4 -mb-1 border-b-2 dark:border-"
              >
                资源
              </a>
            </li>
          </ul>
          <a
            rel="noopener noreferrer"
            href="#"
            aria-label="Back to homepage"
            className="flex  items-center p-2 "
          >
            <Image
              src="/icons/favicon-32x32.png"
              alt="icon"
              width={32}
              height={32}
            />
          </a>
          <div className="flex items-center md:space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button
                  type="submit"
                  title="Search"
                  className="p-1 focus:outline-none focus:ring"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    className="w-4 h-4 dark:text-gray-800"
                  >
                    <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                  </svg>
                </button>
              </span>
              <input
                type="search"
                name="Search"
                placeholder="Search..."
                className="w-32 py-2 pl-10 text-sm text-white rounded-md sm:w-auto focus:outline-none dark:bg-gray-100 dark:text-gray-800 focus:dark:bg-gray-50"
              />
            </div>
            <Button type="link" href="/login" styles={{color:"#333"}} classNames={["hidden", "px-6", "py-2 ","font-semibold", "rounded" ,"lg:block ","dark:bg-violet-600 ","dark:text-gray-50"]}>
              登 录
            </Button>
          </div>,
          <button title="Open menu" type="button" className="p-4 lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 dark:text-gray-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </header>
      {/* 热门文章 */}
      <section className="py-6 sm:py-12  dark:bg-gray-100 dark:text-gray-800">
        <div className="container p-6 mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">推荐文章</h2>
            <p className="font-serif text-sm dark:text-gray-600">
              不知道看什么？这里有最值得一读的文章，发现你的下一个灵感！
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            <article className="flex flex-col dark:bg-gray-50">
              <a
                rel="noopener noreferrer"
                href="#"
                aria-label="Te nulla oportere reprimique his dolorum"
              ></a>
              <div className="flex flex-col flex-1 p-6">
                <a
                  rel="noopener noreferrer"
                  href="#"
                  aria-label="Te nulla oportere reprimique his dolorum"
                ></a>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className="text-xs tracking-wider uppercase hover:underline dark:text-violet-600"
                >
                  分类
                </a>
                <h3 className="flex-1 py-2 text-lg font-semibold leading-snug">
                  Te nulla oportere reprimique his dolorum
                </h3>
                <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs dark:text-gray-600">
                  <span>June 1, 2020</span>
                  <span>2.1K views</span>
                </div>
              </div>
            </article>
            <article className="flex flex-col dark:bg-gray-50">
              <a
                rel="noopener noreferrer"
                href="#"
                aria-label="Te nulla oportere reprimique his dolorum"
              ></a>
              <div className="flex flex-col flex-1 p-6">
                <a
                  rel="noopener noreferrer"
                  href="#"
                  aria-label="Te nulla oportere reprimique his dolorum"
                ></a>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className="text-xs tracking-wider uppercase hover:underline dark:text-violet-600"
                >
                  Convenire
                </a>
                <h3 className="flex-1 py-2 text-lg font-semibold leading-snug">
                  Te nulla oportere reprimique his dolorum
                </h3>
                <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs dark:text-gray-600">
                  <span>June 2, 2020</span>
                  <span>2.2K views</span>
                </div>
              </div>
            </article>
            <article className="flex flex-col dark:bg-gray-50">
              <a
                rel="noopener noreferrer"
                href="#"
                aria-label="Te nulla oportere reprimique his dolorum"
              ></a>
              <div className="flex flex-col flex-1 p-6">
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className="text-xs tracking-wider uppercase hover:underline dark:text-violet-600"
                >
                  Convenire
                </a>
                <h3 className="flex-1 py-2 text-lg font-semibold leading-snug">
                  Te nulla oportere reprimique his dolorum
                </h3>
                <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs dark:text-gray-600">
                  <span>June 3, 2020</span>
                  <span>2.3K views</span>
                </div>
              </div>
            </article>
            <article className="flex flex-col dark:bg-gray-50">
              <a
                rel="noopener noreferrer"
                href="#"
                aria-label="Te nulla oportere reprimique his dolorum"
              ></a>
              <div className="flex flex-col flex-1 p-6">
                <a
                  rel="noopener noreferrer"
                  href="#"
                  aria-label="Te nulla oportere reprimique his dolorum"
                ></a>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className="text-xs tracking-wider uppercase hover:underline dark:text-violet-600"
                >
                  Convenire
                </a>
                <h3 className="flex-1 py-2 text-lg font-semibold leading-snug">
                  Te nulla oportere reprimique his dolorum
                </h3>
                <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs dark:text-gray-600">
                  <span>June 4, 2020</span>
                  <span>2.4K views</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/* 分类导航 */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800">分类导航</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {["前端", "后端", "数据库", "随笔", "Vue", "React"].map(
              (category) => (
                <a
                  key={category}
                  href="#"
                  className="bg-gray-200 hover:bg-blue-500 hover:text-white px-6 py-2 rounded-full transition"
                >
                  {category}
                </a>
              )
            )}
          </div>
        </div>
      </section>
      {/* 关于作者 */}
      <HeroSection></HeroSection>
      {/* 页脚 */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 Jeff的博客. 版权所有</p>
      </footer>
    </div>
  );
}
