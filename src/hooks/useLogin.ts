"use client";

import { reqLogin } from "@/api/auth/login";
import { LoginFormSchema, LoginRequest } from "@/schema/auth";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export function useLogin() {
  const { login, setLoading, setError, isLoading, error } = useAuthStore();
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof LoginRequest, string>>
  >({});

  const handleLogin = async (values: LoginRequest) => {
    const validationResult = LoginFormSchema.safeParse(values);
    if (!validationResult.success) {
      const errors: Partial<Record<keyof LoginRequest, string>> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof LoginRequest] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setLoading(true);
    setError(null);

    try {
      const response = await reqLogin({
        account: values.account,
        loginType: values.loginType,
        password: values.password,
      });

      login(response);
      return response;
    } catch (err: any) {
      setError(err.message || "登录失败，请重试");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
    formErrors,
    setFormErrors,
  };
}
