
import IconfontJavaScript from "@/components/Iconfont/IconfontJavaScript";
import { LayoutProvider } from "@/contexts/LayoutContext";
import Layout from "@/layouts/Layout";


interface LayeoutPageProps{
  children: React.ReactNode;
}



export default  function LayoutPage({ children }:LayeoutPageProps) {
  return (
    <LayoutProvider>
      <IconfontJavaScript scriptName="iconfont"></IconfontJavaScript>
      <Layout>{children}</Layout>
    </LayoutProvider>
  );
}