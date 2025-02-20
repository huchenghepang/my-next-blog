"use client";
import { UserInfo } from "@/app/api/user/info/route";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface LayoutContextType {
  user: UserInfo | null; // 允许 `user` 为空
  setUser: (name: UserInfo) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);




export const LayoutProvider =  ({ children }: { children: ReactNode }) => {



  const [user, setUser] = useState<UserInfo | null>(null); // 初始值设为 `null`
    useEffect(() => {
      const res = fetch("/api/user/info")
        .then((res) => {
          res.json().then((userInfo) => {
            setUser(userInfo.data as UserInfo);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);


  return (
    <LayoutContext.Provider value={{ user, setUser }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
