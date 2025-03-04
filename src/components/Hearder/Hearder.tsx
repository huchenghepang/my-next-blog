"use client";
import { fetcherClient } from "@/utils/fetcher/fetcherClient";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import IsloginBtn from "./IsloginBtn";
import LinkHeader from "./Link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = inputRef.current?.value;
    if (keyword !== "") {
      fetcherClient<{redirect:string}>("/api/article/keyword?"+"keyword="+keyword,{method:"GET"}).then(res=>{
        if(res.body){
          window.location.href = res.body.data.redirect
        }
      }).catch()
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 60);
      setIsHidden(scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky w-full top-0 z-50 transition-all duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } ${isScrolled ? "bg-gray-200 dark:bg-zinc-600" : "bg-transparent"}`}
    >
      <div className="container flex justify-between h-14 mx-auto items-center">
        {/* Logo */}
        <Link
          href="/"
          aria-label="返回首页"
          className="flex items-center  w-40"
        >
          <Image
            src="/png/favicon.png"
            alt="icon"
            style={{ borderRadius: "50%" }}
            width={34}
            height={34}
          />
        </Link>

        {/* 导航栏 */}
        <ul className="flex justify-center">
          <LinkHeader linkText="文 章" href="/posts" />
          <LinkHeader linkText="关 于" href="/about" />
        </ul>

        {/* 右侧功能区 */}
        <div className="flex items-center w-40">
          {/* 主题切换按钮 */}
          <ThemeToggle id="theme-toggle-btn"></ThemeToggle>
          {/* 搜索框 */}
          <div className="relative hidden md:block">
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
            <form onSubmit={handleSubmit} className="ml-3">
              <input
                type="search"
                ref={inputRef}
                name="Search"
                placeholder="搜索文章..."
                className="w-40 py-2 pl-10  text-sm text-black dark:text-gray-800 rounded-md focus:outline-none"
              />
            </form>
          </div>
          {/* 登录按钮 */}
          <IsloginBtn></IsloginBtn>
        </div>
      </div>
    </header>
  );
}
