// components/DropdownMenu.js
import { FC, ReactNode } from "react";
import "./dropdownmenu.scss";

interface DropdownMenuProps {
  options: {
    label: string | ReactNode;
    value?: any;
  }[];
  label: string | ReactNode;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ options, label }) => {
  return (
    <div className="relative inline-block text-left group">
      <button className="px-2 py-2 bg-slate-600 text-white rounded-xl">
        {label}
      </button>

      {/* 下拉菜单 */}
      <div className="absolute left-0 mt-2  bg-white shadow-lg rounded-md  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {options.map((option, index) => (
          <div key={index} className="relative group">
            <a
              href="#"
              className="block px-1 py-1 bg-slate-800 rounded-md text-center  text-cyan-50 "
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
