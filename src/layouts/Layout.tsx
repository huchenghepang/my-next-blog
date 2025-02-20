import React, { ReactNode } from 'react';
import Appmain from './appmain/Appmain';
import { FooTer } from './footer/Footer';
import LayoutStyle from "./Layout.module.scss";
import './main.scss';
import { Sidebar } from './sidebar/Sidebar';
import TopNav from "./topnav/Topnav";

interface LayoutProps {
  children:ReactNode
}


// 根据文件名生成组件
const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <div className={LayoutStyle["Layout-Container"]}>
      <div className="dashboard-container clearfix">
        <Sidebar></Sidebar>
        <div className="appmain">
          <TopNav></TopNav>
          <Appmain>{children}</Appmain>
          <FooTer></FooTer>
        </div>
      </div>
    </div>
  );
};



export default Layout;