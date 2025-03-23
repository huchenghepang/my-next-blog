import Link from "next/link";
import { FC } from "react";

interface pageProps {
  // 这里是组件的属性
  params: Promise<{ info: string[] }>;
}

// 根据文件名生成组件
const page: FC<pageProps> = async ({ params }) => {
  const { info } = await params;
  console.log(info);
  return (
    <div>
      <h2>page</h2>
      
      <p>这个是动态生成的带有类名的组件。</p>
       <p>id：{info[0]}</p> 
       <p>品牌：{info[1]}</p> 
    </div>
  );
};

export default page;
