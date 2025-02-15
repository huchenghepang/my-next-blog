"use client";
import React, { forwardRef, ReactNode, useState } from "react";
import ButtonStyle from "./Button.module.scss";

interface ButtonProps {
  children?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "primary" | "default" | "text" | "link" | "dashed";
  styles?: React.CSSProperties;
  classNames?: string[];
  href?: string;
  size?: "large" | "small" | "default" | "mini";
}

const Button = forwardRef<HTMLButtonElement,ButtonProps>(
  (
    {
      children,
      onClick,
      type = "default",
      classNames = [],
      href,
      styles,
      size = "default",
    },
    ref,
  ) => {
    const [waveStyle, setWaveStyle] = useState<React.CSSProperties | null>(
      null,
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(button.offsetWidth, button.offsetHeight);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      // 直接更新 state，触发 CSS 变化
      setWaveStyle({
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`,
      });

      // 波浪动画结束后移除样式，避免 DOM 频繁创建/删除
      setTimeout(() => {
        setWaveStyle(null);
      }, 600);

      if (onClick) onClick(e);
    };

    const buttonClassNames = [
      ButtonStyle.button,
      ButtonStyle[type],
      ButtonStyle[size],
      ...classNames,
      "clearfix"
    ].join(" ");

    if (href) {
      return (
        <a href={href} style={styles} className={buttonClassNames}>
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClassNames}
        onClick={handleClick}
        style={styles}
      >
        {children}
        {waveStyle && <span className={ButtonStyle.wave} style={waveStyle} />}
      </button>
    );
  },
);

Button.displayName = "Button"

export default Button;
