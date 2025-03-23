import { FC, ReactNode } from 'react';
interface PageProps {
  // 这里是组件的属性
    children:ReactNode;
    detail:ReactNode;
    
}

const Layout: FC<PageProps> = ({children,detail}) => {
  return (
    <>
    {children}
    {detail}
    </>
  );
};

export default Layout;