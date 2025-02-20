import React, { memo, useCallback, useState } from "react";
import avatorStyle from "./avator.module.scss";

// 定义组件的 Props 类型
interface AvatarProps {
  src?: string; // 头像图片地址
  alt?: string; // 图片的描述文本
  size?: number; // 头像尺寸，默认为 40px
  defaultAvatar?: string; // 占位头像的地址
  onClick?: () => void; // 点击事件
}

// 根据文件名生成组件
const Avator: React.FC<AvatarProps> = ({
  src,
  alt = "用户头像",
  size = 45,
  defaultAvatar = "https://api.dicebear.com/6.x/adventurer/svg?seed=random&radius=50&backgroundColor=f0f0f0&scale=100", // 默认占位头像
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);

  // 处理图片加载错误，显示默认头像
  const handleError = useCallback(() => {
    setImageSrc(defaultAvatar);
  }, [defaultAvatar]);


  return  (
      <img
        src={imageSrc || defaultAvatar}
        alt={alt}
        width={size}
        height={size}
        onError={handleError}
        onClick={onClick}
        style={{
          borderRadius: "50%", // 圆形头像
          cursor: onClick ? "pointer" : "default", // 点击事件时显示指针
          objectFit: "cover", // 确保图片裁剪不变形
        }}
        className={avatorStyle["avator-Container"]}
      ></img>
    )

};

export default memo(Avator);
