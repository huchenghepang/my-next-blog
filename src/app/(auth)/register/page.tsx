"use client";

import { useReducer } from "react";

import Button from "@/components/Button/Button";
import IconfontJavaScript from "@/components/Iconfont/IconfontJavaScript";
import { showMessage } from "@/components/Message/MessageManager";
import { useFormReducer } from "@/hooks/useFormReducer";
import {authClient} from "@/lib/auth.client"
import RegisterStyle from "./Register.module.scss";

const initialErrorState = {
  accountError: undefined,
  passwordError: undefined,
  confirmPassword: undefined,
}
interface ErrorState {
  accountError: string | undefined
  passwordError: string | undefined
  confirmPassword: string | undefined
}

interface ErrorAction {
  type: "accountError" | "passwordError" | "confirmPassword" | "reset"
  message: string
}
function reducer(state: ErrorState, action: ErrorAction) {
  switch (action.type) {
    case "accountError":
      return {...state, [action.type]: action.message}
    case "confirmPassword":
      return {...state, [action.type]: action.message}
    case "passwordError":
      return {...state, [action.type]: action.message}
    case "reset":
      return initialErrorState
    default:
      throw new Error()
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
        return dispatchError({
          type: "confirmPassword",
          message: "密码需要与确认密码一致",
        })
      }
     
      const data = await authClient.signUp.email({
        email: formState.account,
        password: formState.password,
        name: formState.account,
        callbackURL: "/login",
      })
      showMessage({type: "success", text: "注册成功"})
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
          {errors.passwordError || errors.confirmPassword}
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
          {errors.confirmPassword}
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
  )
};

export default RegisterPage;
