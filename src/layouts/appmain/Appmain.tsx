import React, { ReactNode } from "react";
import AppmainStyle from "./Appmain.module.scss";

// 定义组件的 Props 类型
interface AppmainProps {
  // 这里是组件的属性
  children:ReactNode
}

// 根据文件名生成组件
const Appmain: React.FC<AppmainProps> = ({children}) => {
  return <div className={AppmainStyle["Appmain-Container"]}>{children}</div>;
};

export default Appmain;
