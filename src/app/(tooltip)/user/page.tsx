import userStyle from './user.module.scss';

export default function Page() {
  return (
    <div className={userStyle['user-container']}>
      <h2>User Page</h2>
      <p>这个是动态生成的带有类名的组件。</p>
    </div>
  );
}
