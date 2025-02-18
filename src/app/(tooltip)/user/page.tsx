import Button from "@/components/Button/Button";
import IconfontJavaScript from "@/components/Iconfont/IconfontJavaScript";
import LogoutButton from "@/components/LoginzButton";
import prisma from "@/utils/prisma";
import { getSession } from "@/utils/session";
import { validatePermission } from "@/utils/validatePermission";
import { redirect } from "next/navigation";
import userStyle from "./user.module.scss";

async function getUsers() {
  try {
    const users = await prisma.user_info.findMany();
    return users;
  } catch (error) {
    return null;
  }
}

export default async function Page() {
  const session = (await getSession("sky-session")) 
  const users = await getUsers();
  if (!session) {
    redirect("/login");
  }
  

  const isTogglerRole = await validatePermission(1, 2);
  return (
    <div className={userStyle["user-container"]}>
      <IconfontJavaScript scriptName="message_iconfont"></IconfontJavaScript>
      <h2>用户名:{session.user?.account}</h2>
      <h2>角色:{session.user?.currentRole?.role_name}</h2>
      <p>这个是动态生成的带有类名的组件。</p>
      <LogoutButton></LogoutButton>
      {isTogglerRole && <Button>切换用户角色</Button>}
      {users && (users.map(user=>{return (
        <p key={user.user_id}>
          <span>用户名：{user.username}</span>
          <span>个性签名：{user.signature}</span>
        </p>
      ) }))}
    </div>
  );
}
