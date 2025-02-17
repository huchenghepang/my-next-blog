import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Button from '@/app/components/Button/Button';
import IconfontJavaScript from '@/app/components/Iconfont/IconfontJavaScript';
import LogoutButton from '@/app/components/LoginzButton';
import { getSession } from '@/app/utils/session';
import { validatePermission } from '@/app/utils/validatePermission';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import userStyle from './user.module.scss';




export default async function Page() {
  const session = await getSession() || await getServerSession(authOptions) ;
  if (!session) {
    redirect("/login");
  }

  const isTogglerRole = await validatePermission(38,58)
  return (
    <div className={userStyle["user-container"]}>
      <IconfontJavaScript scriptName="message_iconfont"></IconfontJavaScript>
      <h2>用户名{session.user?.name}</h2>
      <h2>用户角色{session.user?.currentRole.role_name}</h2>
      <h2>用户ID{session.user?.userId}</h2>
      <p>这个是动态生成的带有类名的组件。</p>
      <Link href={"/loginout"}>退出登录</Link>
      <LogoutButton></LogoutButton>
      {isTogglerRole && <Button>切换用户角色</Button>}
    </div>
  );
}
