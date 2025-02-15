import { ReactNode } from "react";
import ToolTips from "../components/Tooltips/Tooltips";

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
