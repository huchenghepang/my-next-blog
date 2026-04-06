import Header from "@/components/Header/Header";
import { ReactNode } from "react";

export default function LayoutWithBubbles({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header></Header>
      {children}
    </>
  );
}
