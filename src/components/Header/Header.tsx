"use client";
import throttle from "@/utils/throttle";
import { useEffect, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import HeaderSearch from "./Header-Search";
import IsloginBtn from "./IsloginBtn";
import LinkHeader from "./Link";
import Logo from "./Logo";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 0);
      setIsHidden(scrollY > window.innerHeight);
    }, 1000);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky  w-full top-0 z-50 transition-all duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } ${isScrolled ? "bg-gray-200 dark:bg-zinc-600" : "bg-transparent"}`}
    >
      <div className="container flex justify-between h-14 mx-auto items-center">
        <Logo link="/" title="返回首页" className="w-100"></Logo>

        {/* 导航栏 */}
        <ul className="flex justify-between space-x-4 h-full">
          <LinkHeader linkText="文 章" href="/posts" />
          <LinkHeader linkText="主 站" href="https://huchenghe.site" />
          <LinkHeader linkText="关 于" href="/about" />
        </ul>

        {/* 右侧功能区 */}
        <div className="flex items-center w-100">
          {/* 主题切换按钮 */}
          <ThemeToggle id="theme-toggle-btn"></ThemeToggle>

          {/* 搜索框 */}
          <HeaderSearch placeholder="搜索文章..."></HeaderSearch>

          {/* 登录按钮 */}
          <div className="flex mx-2">
            <IsloginBtn></IsloginBtn>
          </div>
        </div>
      </div>
    </header>
  );
}
