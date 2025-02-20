"use client";
import React, { memo, MouseEvent, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { GrUp } from "react-icons/gr";
import IconFont, { IconName } from "../Iconfont/Iconfont";
import MultiLevelNavStyle from "./MultiLevelNav.module.scss";
import NavItem from "./NavItem";

// 定义组件的 Props 类型
export interface MultiLevelNavProps {
  text: string;
  active?: boolean;
  to?:string;
  leftIcon?: IconName;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  childrenInfo?: MultiLevelNavProps[];
}

// 根据文件名生成组件
const MultiLevelNav: React.FC<MultiLevelNavProps> = ({
  text,
  active,
  leftIcon,
  to,
  onClick,
  childrenInfo,
}: MultiLevelNavProps) => {
  const [isExpanded, setExpanded] = useState(false);
  const toggleExpandedHandler = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setExpanded(!isExpanded);
    return 
  };

  return (
    <div className={MultiLevelNavStyle["MultiLevelNav-Container"]}>
      <NavItem
        text={text}
        leftElement={leftIcon && <IconFont name={leftIcon}></IconFont>}
        active={active}
        to={to}
        onClick={onClick}
        rightElement={
          childrenInfo &&
          (isExpanded ? (
            <GrUp onClick={toggleExpandedHandler}></GrUp>
          ) : (
            <FaAngleDown onClick={toggleExpandedHandler}></FaAngleDown>
          ))
        }
      ></NavItem>
      {isExpanded && childrenInfo && (
        <div className={MultiLevelNavStyle["ChildContainer"]}>
          {childrenInfo.map((child, index) => (
            <MultiLevelNav key={index} {...child} />
          ))}
        </div>
      )}{" "}
    </div>
  );
}
export default memo(MultiLevelNav);
