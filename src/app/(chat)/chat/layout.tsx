"use client";

import { setupFetcher } from "@/api/frontendClient";
import { setupTokenListener } from "@/store/tokenListener";
import { ConfirmProvider } from "material-ui-confirm";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setupTokenListener();
    setupFetcher();
  }, []);
  const pathname = usePathname();

  useEffect(() => {
    document.title = "World Chat - AI";
  }, [pathname]);
  return (
    <ConfirmProvider
      defaultOptions={{
        dialogProps: {
          PaperProps: {
            sx: {
              backgroundColor: "background.paper",
              color: "text.primary",
            },
          },
        },
      }}
    >
      <ToastContainer></ToastContainer>
      {children}
    </ConfirmProvider>
  );
}
