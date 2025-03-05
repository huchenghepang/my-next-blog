"use client"
import { FC, ReactNode } from "react";
import "./dropdownmenu.scss";

interface DropdownMenuProps {
  options: {
    label: string | ReactNode;
    value?: any;
    onClick?: () => void;
  }[];
  label: string | ReactNode;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ options, label }) => {
  return (
    <div className="z-50 relative text-center inline-block group">
      <button className="px-1 py-2 bg-slate-400 text-white rounded-xl">
        {label}
      </button>

      {/* 下拉菜单 */}
      <div className="absolute flex flex-col justify-center w-full mt-2 bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {options.map((option, index) => (
          <div key={index} className="relative group w-full rounded-lg">
            <a
              href="#"
              onClick={option.onClick}
              className="block px-1 py-1 bg-neutral-400 w-full text-center  text-cyan-50 border-b hover:bg-slate-400"
            >
              {option.label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DropdownMenu;
