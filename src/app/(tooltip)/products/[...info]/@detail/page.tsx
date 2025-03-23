import {FC} from 'react';
interface PageProps {
  // 这里是组件的属性
  params:Promise<{info:string[]}>;
}

const PageProps: FC<PageProps> = (props) => {
  return (
    <div >
      <h2>page</h2>
      <p>详情页面</p>
    </div>
  );
};

export default PageProps;