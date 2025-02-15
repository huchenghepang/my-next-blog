"use client";

import { useState } from "react";
import { BsGithub } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";


import { useFormReducer } from "@/app/hooks/useFormReducer";
import { CustomResponse } from "@/types/customResponse";
import loginStyle from "./Login.module.scss";

// 根据文件名生成组件
 const LoginPage= () => {
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
       }) ;

       const data:CustomResponse = await response.json()
       if (!response.ok) {
         setErrors(data.errorMessage)
         throw new Error("登录失败，请检查用户名和密码");
       }
       alert("登录成功")
     } catch (error) {
       console.error("登录请求错误", error);
     }
   };

     const resetError = () => {
       setErrors('');
     };

   return (
     <div className={loginStyle["Login-Container"]}>
       {isGithubLogin ? (
         <div className={loginStyle["Github-Login"]}>
           <h2 className={loginStyle["Login-Title"]}>GitHub 登录</h2>
           <button className={loginStyle["Github-Button"]}>
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



export default LoginPage

