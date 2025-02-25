import Header from "@/components/Hearder/Hearder";
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
