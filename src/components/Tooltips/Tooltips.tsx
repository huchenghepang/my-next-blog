"use client";
import { BiHomeAlt } from "react-icons/bi";
import { CiCircleChevUp } from "react-icons/ci";
import { IoIosContact } from "react-icons/io";
import ThemeToggle from "../ThemeToggle";

const backTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
export default function ToolTips() {
  return (
    <div className="fixed bottom-20 right-20 space-y-3 max-md:bottom-40 max-md:right-1">
      <ul className="space-y-3">
        {/* 联系我按钮 */}
        <li className="group  flex text-orange-300 items-center  space-x-2 cursor-pointer">
          <IoIosContact
            className="text-3xl group-hover:text-yellow-600 transition-all"
            size={36}
          />
          <span className="hidden group-hover:block text-sm bg-gray-800 text-white px-2 py-1 rounded-lg">
            联系方式:
            <a type="email" href="mailto:huchenghe1021@outlook.com">
              2927678784@qq.com
            </a>
          </span>
        </li>

        {/* 主题切换按钮 */}
        <li className="group flex items-center space-x-2 cursor-pointer justify-center">
          <ThemeToggle id="theme-toggle-btn" />
        </li>

        {/* 返回顶部按钮 */}
        <li className="group flex items-center space-x-2 cursor-pointer">
          <CiCircleChevUp
            id="theme-toggle-btn"
            onClick={backTop}
            className="text-3xl group-hover:text-yellow-600 transition-all"
            size={36}
          />
        </li>
        <li
          className="group flex items-center space-x-2 cursor-pointer"
          title="返回首页"
        >
          <BiHomeAlt
            id="theme-toggle-btn"
            onClick={() => {
              window.location.href = "/";
            }}
            className="text-3xl text-cyan-200 group-hover:text-yellow-600 transition-all"
            size={36}
          />
        </li>
      </ul>
    </div>
  );
}
