import {
  MessageComponentIcon,
  ReactTemplateIcon,
  SearchFrameIcon,
} from "@/types/iconfont";
import React from "react";


export type IconName =
  | MessageComponentIcon
  | ReactTemplateIcon
  | SearchFrameIcon;





interface IconFontProps {
  name: IconName;
  width?: string;
  height?: string;
  fillColor?: string;
}

const IconFont: React.FC<IconFontProps> = ({
  name,
  width = "1em",
  height = "1em",
  fillColor,
}) => (
  <svg
    className="svg-icon"
    aria-hidden="true"
    width={width}
    fill={fillColor}
    height={height}
  >
    <use xlinkHref={`#${name}`} />
  </svg>
);



export default IconFont;
