""
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  await signOut({ redirect: false }); // 清除会话，但不重定向
  redirect("/login"); // 手动重定向到登录页面
}
