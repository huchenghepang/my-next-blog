import { FC, ReactNode } from 'react';
interface PageProps {
    children:ReactNode;
    model:ReactNode;
}

const Layout: FC<PageProps> = ({children,model}) => {
  return (
    <>
        {model}
        {children}
    </>
  );
};

export default Layout;