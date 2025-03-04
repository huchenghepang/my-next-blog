"use client";

import { getLocalStorage } from "@/utils/localStore";
import { Avatar } from "antd";
import { useEffect, useState } from "react";
import Button from "../Button/Button";

// 根据文件名生成组件
const IsloginBtn = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>();

  // 新增加载状态
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    // 获取登录状态
    const storedIsLogin = !!getLocalStorage("isLogin");
    setIsLogin(storedIsLogin);

    // 获取用户头像
    const userInfo = getLocalStorage("userInfo");
    const storedAvatar = userInfo ? userInfo.user.avatar : undefined;
    setAvatar(storedAvatar);
    // requestAnimationFrame(raf);
    // 加载完成
    setIsLoading(false);

  }, []);
  //   useDampingScroll(undefined, 0.6);

  if (isLoading) {
    // 加载中不显示登录状态
    return null;
  }

  return (
    // 根据登录状态渲染不同组件
    isLogin ? (
      <Avatar src={avatar} size={50} />
    ) : (
      <Button
        type="link"
        href="/login"
        styles={{
          textDecoration: "none",
        }}
        classNames={[
          "hidden",
          "bg-transparent",
          "font-semibold",
          "rounded",
          "dark:text-white",
          "lg:block",
        ]}
      >
        登 录
      </Button>
    )
  );
};

export default IsloginBtn;
