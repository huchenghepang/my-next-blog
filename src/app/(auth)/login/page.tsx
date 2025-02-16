"use client";

import { useState } from "react";
import { BsGithub } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";

import IconfontJavaScript from "@/app/components/Iconfont/IconfontJavaScript";
import { showMessage } from "@/app/components/Message/MessageManager";
import { useFormReducer } from "@/app/hooks/useFormReducer";
import { CustomResponse } from "@/types/customResponse";
import { signIn } from "next-auth/react";
import loginStyle from "./Login.module.scss";
  
// 根据文件名生成组件
const LoginPage = () => {
  const [isGithubLogin, setIsGithubLogin] = useState(false);
  const toggleLoginMethod = () => {
    setIsGithubLogin(!isGithubLogin);
  };
  const [errors, setErrors] = useState<string>();
  const { formState, handleChange, resetForm } = useFormReducer({
    account: "",
    password: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // 修改为 x-www-form-urlencoded
        },
        body: new URLSearchParams({
          account: formState.account,
          password: formState.password,
        }).toString(), // 使用 URLSearchParams 将数据编码成 x-www-form-urlencoded 格式
      });

      const data: CustomResponse = await response.json();
      if (!response.ok) {
        setErrors(data.errorMessage);
        return showMessage({
          type: "error",
          text: data.errorMessage || "登录失败",
        });
      }
      showMessage({ type: "success", text: "登录成功" });
      window.location.href = "/user";
    } catch (error) {
      console.log(error);
      showMessage({ type: "error", text: "登录出错" });
    } finally {
      resetForm();
    }
  };

  const resetError = () => {
    setErrors("");
  };

  return (
    <div className={loginStyle["Login-Container"]}>
      <IconfontJavaScript scriptName="message_iconfont"></IconfontJavaScript>
      {isGithubLogin ? (
        <div className={loginStyle["Github-Login"]}>
          <h2 className={loginStyle["Login-Title"]}>GitHub 登录</h2>
          <button className={loginStyle["Github-Button"]} onClick={()=>signIn("github",{callbackUrl:"/user"})}>
            使用 GitHub 登录
          </button>
          <button
            onClick={toggleLoginMethod}
            type="button"
            className={loginStyle["Toggle-Button"]}
          >
            <IoMdArrowRoundBack
              fill="red"
              style={{ fontSize: "24px" }}
            ></IoMdArrowRoundBack>
          </button>
        </div>
      ) : (
        <form
          method="POST"
          className={loginStyle["Login-Form"]}
          onSubmit={handleSubmit}
        >
          <h2 className={loginStyle["Login-Title"]}>登录</h2>
          <input
            type="text"
            key={""}
            name="account"
            value={formState.account || ""}
            placeholder="手机号或邮箱"
            onChange={handleChange}
            onFocus={resetError}
            autoComplete="account"
            required
            className={loginStyle["Login-Input"]}
          />
          <p className={loginStyle["Login-Error"]}>{errors}</p>
          <input
            key={"password"}
            type="password"
            value={formState.password || ""}
            autoComplete="password"
            onChange={handleChange}
            className={loginStyle["Login-Input"]}
            name="password"
            onFocus={resetError}
            placeholder="密码"
            required
          />

          <button type="submit" className={loginStyle["Login-Button"]}>
            登录
          </button>
          <div className={loginStyle["Login-Bottom"]}>
            <a>忘记密码？</a>
            <button
              onClick={toggleLoginMethod}
              type="button"
              className={loginStyle["Toggle-Button"]}
            >
              <BsGithub></BsGithub>
              <span>github登录</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
