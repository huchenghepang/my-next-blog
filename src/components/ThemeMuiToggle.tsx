"use client"

import {useColorScheme} from "@mui/material/styles"

const ThemeMuiToggle = ({id}: {id: string}) => {
  const {mode, setMode} = useColorScheme()
  if (!mode) {
    return null
  }
  return (
    <button
      id={id}
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light")
      }}
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
      {mode === "light" ? "☀️" : "🌙"}
    </button>
  )
}

export default ThemeMuiToggle
