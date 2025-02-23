"use client";
import { CiCircleChevUp } from "react-icons/ci";
import { IoIosContact } from "react-icons/io";
import ThemeToggle from "../ThemeToggle";

export default function ToolTips() {
     const handleThemeToggle = () => {
       const themeToggleButton = document.getElementById("theme-toggle-btn");
       if (themeToggleButton) {
         themeToggleButton.click(); // 触发点击事件
       }
     };

     const backTop = ()=>{
        window.scrollTo({top:0,behavior:"smooth"})
     }

  return (
    <div className="fixed bottom-20 right-20 space-y-3">
      <ul className="space-y-3">
        {/* 联系我按钮 */}
        <li className="group  flex items-center  space-x-2 cursor-pointer">
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
          <span
            onClick={handleThemeToggle}
            className="hidden group-hover:block text-sm bg-gray-800 text-white px-2 py-1 rounded-lg"
          >
            切换主题
          </span>
        </li>

        {/* 返回顶部按钮 */}
        <li className="group flex items-center space-x-2 cursor-pointer">
          <CiCircleChevUp
            id="theme-toggle-btn"
            onClick={backTop}
            className="text-3xl group-hover:text-yellow-600 transition-all"
            size={36}
          />
          <span
            onClick={backTop}
            className="hidden group-hover:block text-sm bg-gray-800 text-white px-2 py-1 rounded-lg"
          >
            返回顶部
          </span>
        </li>
      </ul>
    </div>
  );
}
