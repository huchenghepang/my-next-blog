"use client";

import { getLocalStorage } from "@/utils/localStore";
import { Avatar } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../Button/Button";

const IsloginBtn = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const storedIsLogin = !!getLocalStorage("isLogin");
    setIsLogin(storedIsLogin);

    const userInfo = getLocalStorage("userInfo");
    const storedAvatar = userInfo ? userInfo.user.avatar : undefined;
    setAvatar(storedAvatar);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return isLogin ? (
    <Link href={"/dashboard"}>
      <Avatar src={avatar} size={50} />
    </Link>
  ) : (
    <Button
      type="link"
      href="/login"
      styles={{
        color: "skyblue",
        textIndent: "8px",
        padding: "4px 16px",
        borderRadius: "50%",
      }}
      className="bg-transparent font-semibold dark:text-white lg:block "
    >
      登 录
    </Button>
  );
};

export default IsloginBtn;
