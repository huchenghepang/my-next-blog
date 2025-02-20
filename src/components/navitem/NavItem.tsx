"client";
import { useRouter } from "next/navigation";
import React, { MouseEvent } from "react";
import NavItemStyle from "./NavItem.module.scss";

// 定义组件的 Props 类型
interface NavItemProps {
  text: string;
  active?: boolean;
  to?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  // 这里是组件的属性
}

// 根据文件名生成组件
const NavItem: React.FC<NavItemProps> = ({
  text,
  active,
  to,
  leftElement,
  rightElement,
  onClick,
}: NavItemProps) => {
  const router = useRouter();
  const onClickHandler = (event: MouseEvent<HTMLDivElement>) => {
    if (to && typeof window !== "undefined") {
      router.push(to);
    }
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <div className={`${NavItemStyle["nav-item"]}`} onClick={onClickHandler}>
      <div className={NavItemStyle["left-info"]}>{leftElement}</div>
      <div className={NavItemStyle.middle}>
        <span>{text}</span>
      </div>
      <div className={NavItemStyle["right-info"]}>{rightElement}</div>
    </div>
  );
};

export default NavItem;
