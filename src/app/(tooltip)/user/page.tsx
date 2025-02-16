import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import IconfontJavaScript from '@/app/components/Iconfont/IconfontJavaScript';
import LogoutButton from '@/app/components/LoginzButton';
import { getSession } from '@/app/utils/session';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import userStyle from './user.module.scss';




export default async function Page() {
  const session = await getSession() || await getServerSession(authOptions) ;
  if (!session) {
    redirect("/login");
  }
  return (
    <div className={userStyle["user-container"]}>
      <IconfontJavaScript scriptName="message_iconfont"></IconfontJavaScript>
      <h2>用户名{session.user?.name}</h2>
      <h2>用户角色{session.user?.currentRole.role_name}</h2>
      <h2>用户ID{session.user?.userId}</h2>
      <img src={session.user?.image} />
      <p>这个是动态生成的带有类名的组件。</p>
      <Link href={"/loginout"}>退出登录</Link>
      <LogoutButton></LogoutButton>
    </div>
  );
}
