"use client";
import Avator from "@/components/avator/avator";
import DropMenu from "@/components/DropMenu/DropMenu";
import { useLayout } from "@/contexts/LayoutContext";
import { Select } from "antd";
import { useMemo } from "react";
import Search from "../../components/search/Search";
import "./navtop.scss";
import LogoutButton from "@/components/LoginzButton";

const TopNav = () => {
  const { user, setUser } = useLayout();

  const currentRole = useMemo(() => {
    return {
      value: user?.currentRole.role_id,
      label: user?.currentRole.role_name,
    };
  }, [user]);
  const userInfo = useMemo(() => {
    return {
      ...user?.user,
    };
  }, [user]);

  const handleLogout = () => {
    console.log("Logging out...");
    // 执行退出登录的逻辑，例如清除本地存储、重定向到登录页
  };

  const roles = useMemo(() => {
    if (user?.roles) {
      return [{ value: 2, label: "普通用户" }];
    }
    return user?.roles?.map((roleID) => {
      if (roleID === 1) {
        return { value: 1, label: "管理员" };
      } else if (roleID === 2) {
        return { value: 2, label: "普通用户" };
      } else {
        return { value: 3, label: "Vip用户" };
      }
    });
  }, [user]);

  const handleRoleChange = (role: { value?: number; label?: string }) => {
    console.log("Switched to role:", role);
  };
  return (
    <div>
      <div className="topNavigation-container ">
        <DropMenu
          options={[{ value: "1", label: "你好" }]}
          label="还还好"
        ></DropMenu>
        <Search onEnter={(value) => console.log(value)}></Search>
        <div className="navtop-center" />
        <div className="navtop-right-ctn ">
          
          <div className="person-info">
            <span className="username">{userInfo?.username}</span>
            <Select
              defaultValue={currentRole}
              options={roles}
              onChange={handleRoleChange}
              style={{ width: "120px" }}
            ></Select>
          </div>
          <DropMenu
            options={[{label:<LogoutButton size={"mini"} ></LogoutButton>,value:1}]}
            label={<Avator src="/png/noAi.png"></Avator>}
          ></DropMenu>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
