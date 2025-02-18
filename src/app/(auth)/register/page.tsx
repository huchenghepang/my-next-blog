"use client";

import { useReducer } from "react";

import Button from "@/components/Button/Button";
import IconfontJavaScript from "@/components/Iconfont/IconfontJavaScript";
import { showMessage } from "@/components/Message/MessageManager";
import { useFormReducer } from "@/hooks/useFormReducer";
import { CustomResponse } from "@/types/customResponse";
import RegisterStyle from "./Register.module.scss";

const initialErrorState = {
  accountError: undefined,
  passwordError: undefined,
  confimPassword: undefined,
};
interface ErrorState {
  accountError: string | undefined;
  passwordError: string | undefined;
  confimPassword: string | undefined;
}

interface ErrorAction {
  type: "accountError" | "passwordError" | "confimPassword" | "reset";
  message: string;
}
function reducer(state: ErrorState, action: ErrorAction) {
  switch (action.type) {
    case "accountError":
      return { ...state, [action.type]: action.message };
    case "confimPassword":
      return { ...state, [action.type]: action.message };
    case "passwordError":
      return { ...state, [action.type]: action.message };
    case "reset":
      return initialErrorState;
    default:
      throw new Error();
  }
}

// 根据文件名生成组件
const RegisterPage = () => {
  const [errors, dispatchError] = useReducer(reducer, initialErrorState);
  const { formState, handleChange, resetForm } = useFormReducer({
    account: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      if(formState.password !== formState.confirmPassword ){
        return dispatchError({type:"confimPassword",message:"密码需要与确认密码一致"})
      }
      const response = await fetch("/api/auth/register", {
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
        dispatchError({
          type: "accountError",
          message: data.errorMessage || "",
        });
        return showMessage({
          type: "error",
          text: data.errorMessage || "注册失败",
        });
      }
      showMessage({ type: "success", text: "注册成功" });
      setTimeout(()=>{
        window.location.href = "/login";
      },4000)
    } catch (error) {
      console.log(error);
      showMessage({ type: "error", text: "注册出错" });
    } finally {
      resetForm();
    }
  };

  const resetError = () => {
    dispatchError({ type: "reset", message: "" });
  };

  return (
    <div className={RegisterStyle["Register-Container"]}>
      <IconfontJavaScript scriptName="message_iconfont"></IconfontJavaScript>

      <form
        method="POST"
        className={RegisterStyle["Register-Form"]}
        onSubmit={handleSubmit}
      >
        <h2 className={RegisterStyle["Register-Title"]}>注册</h2>
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
          className={RegisterStyle["Register-Input"]}
        />
        <p className={RegisterStyle["Register-Error"]}>{errors.accountError}</p>
        <input
          key={"password"}
          type="password"
          value={formState.password || ""}
          onChange={handleChange}
          className={RegisterStyle["Register-Input"]}
          name="password"
          onFocus={resetError}
          placeholder="密码"
          required
        />
        <p className={RegisterStyle["Register-Error"]}>
          {errors.passwordError || errors.confimPassword}
        </p>
        <input
          key={"confirmPassword"}
          type="password"
          value={formState.confirmPassword || ""}
          onChange={handleChange}
          className={RegisterStyle["Register-Input"]}
          name="confirmPassword"
          onFocus={resetError}
          placeholder="确认密码"
          required
        />
        <p className={RegisterStyle["Register-Error"]}>
          {errors.confimPassword }
        </p>
        <button type="submit" className={RegisterStyle["Register-Button"]}>
          注册
        </button>
        <div className={RegisterStyle["Register-Bottom"]}>
          <Button type="link" size="mini" href="/login">
            已有账号？登录
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
