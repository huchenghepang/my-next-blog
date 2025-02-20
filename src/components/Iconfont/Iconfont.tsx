"use client";
import {
  MessageComponentIcon,
  ReactTemplateIcon,
  SearchFrameIcon,
} from "@/types/iconfont";
import React, { MouseEventHandler, ReactEventHandler } from "react";


export type IconName =
  | MessageComponentIcon
  | ReactTemplateIcon
  | SearchFrameIcon;





interface IconFontProps {
  name: IconName;
  width?: string;
  height?: string;
  fillColor?: string;
  onClick?: ReactEventHandler<SVGSVGElement>;
}

const IconFont: React.FC<IconFontProps> = ({
  name,
  width = "1em",
  height = "1em",
  fillColor,
  onClick,
}) => (
  <svg
    className="svg-icon"
    aria-hidden="true"
    width={width}
    fill={fillColor}
    onClick={onClick}
    height={height}
  >
    <use xlinkHref={`#${name}`} />
  </svg>
);



export default IconFont;
