"use client";
import DropMenu from "@/components/DropMenu/DropMenu";
import { showMessage } from "@/components/Message/MessageManager";
import { useLayout } from "@/contexts/LayoutContext";
import { Select } from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import Search from "../../components/search/Search";
import "./navtop.scss";

const TopNav = () => {
  const { user, setUser } = useLayout();
  const params = useSearchParams()
  
  useEffect(()=>{
   if (params?.has("isLogin")) {
     showMessage({ type: "success", text: "登录成功" });
   }
  },[])
  

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
        <Search onEnter={(value) => console.log(value)}></Search>
        <div className="navtop-center" />
        <div className="navtop-right-ctn ">
          
          <div className="person-info">
            <Select
              defaultValue={currentRole}
              placeholder="切换角色"
              options={roles}
              onChange={handleRoleChange}
              style={{ width: "120px" }}
            ></Select>
          </div>
          <DropMenu
            options={[{label:"修改个人信息",value:1},{label:"退出登录",value:2},{label:"设置",value:1}]}
            label={userInfo.username}
          ></DropMenu>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
