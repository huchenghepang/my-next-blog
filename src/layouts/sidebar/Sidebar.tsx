"use client";
import { FC } from "react";
import MultiLevelNav from "../../components/navitem/MultiLevelNav";

import "./sidebar.scss";



export const Sidebar: FC = () => {
  return (
    <aside className="sidebar-container clearfix">
      <div className="dashboard-title clearfix">
        <h2>天空后台</h2>
      </div>
      <div className="sidebar-itemlist">
        <div className="home-section sidebar-section">
          <h3 className="sidebar-title-3">主界面</h3>
          <div className="section-detail">
            <MultiLevelNav
              text="主页"
              leftIcon="icon-zhuye"
              to="/"
            ></MultiLevelNav>
            <MultiLevelNav
              text="分析"
              leftIcon="icon-zhuye"
              to="/dashboard/analyze"
            ></MultiLevelNav>
          </div>
        </div>
        <div className="pages-section sidebar-section">
          <h3 className="sidebar-title-3">页面</h3>

          <div className="section-detail">
            <MultiLevelNav
              text="文章管理"
              leftIcon="icon-menu"
              to="/dashboard/article"
              childrenInfo={[
                {
                  text: "创建文章",
                  leftIcon: "icon-form",
                  to: "/dashboard/article/edit",
                },
              ]}
            ></MultiLevelNav>
            <MultiLevelNav
              text="用户管理"
              leftIcon="icon-jinggao"
              to="/dashboard/user"
            ></MultiLevelNav>
          </div>
        </div>
        <div className="elements-section sidebar-section">
          <h3 className="sidebar-title-3">组件</h3>
          <div className="section-detail">
            <div className="sidebar-nav-item">
              <div className="left-info"></div>
              <div className="middle">
                <span>Component</span>
              </div>
              <div className="right-info"></div>
            </div>
            <div className="sidebar-nav-item">
              <div className="left-info"></div>
              <div className="middle">
                <span>Form</span>
              </div>
              <div className="right-info"></div>
            </div>
            <div className="sidebar-nav-item">
              <div className="left-info"></div>
              <div className="middle">
                <span>Table</span>
              </div>
              <div className="right-info"></div>
            </div>
            <div className="sidebar-nav-item">
              <div className="left-info"></div>
              <div className="middle">
                <span>Icons</span>
              </div>
              <div className="right-info"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
