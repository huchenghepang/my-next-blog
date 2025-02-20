"use client";
import { useLayout } from "@/contexts/LayoutContext";
import Search from "../../components/search/Search";
import "./navtop.scss";

const TopNav =  () => {
  const { user, setUser } = useLayout();

  return (
    <div>
      <div className="topNavigation-container ">
        <Search onEnter={(value) => console.log(value)}></Search>
        <div className="navtop-center" />
        <div className="navtop-right-ctn "></div>
        <span>{user?user.user.username:""}</span>
      </div>
    </div>
  );
};

export default TopNav;
