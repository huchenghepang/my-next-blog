import { FC } from 'react';


// 定义组件的 Props 类型
interface PageProps {
  // 这里是组件的属性
  title:"编辑文章"
}

// 根据文件名生成组件
const Page: FC<PageProps> = ({title}) => {
  return (
    <div >
      <h2>{title}</h2>
      <p>这个是动态生成的带有类名的组件。</p>
    </div>
  );
};

export default Page;