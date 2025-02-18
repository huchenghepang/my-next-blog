import ToolTips from "@/components/Tooltips/Tooltips";
import { ReactNode } from "react";


export default function LayoutWithToolTip({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <ToolTips></ToolTips>
    </>
  );
}
