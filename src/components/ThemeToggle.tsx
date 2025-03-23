"use client";

import { useTheme } from "../hooks/useTheme";


const ThemeToggle = ({id}:{id:string}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      id={id}
      onClick={toggleTheme}
      className="
        p-2 
        rounded-full 
        transition-all 
        duration-300 
        ease-in-out 
        bg-gradient-to-r 
        from-blue-400 
        to-purple-500 
        hover:from-purple-500 
        hover:to-blue-400 
        text-white 
        shadow-lg 
        hover:shadow-2xl 
        dark:bg-gray-800 
        dark:text-gray-200 
        dark:hover:bg-gray-700
      "
    >
      {theme === "light" ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
