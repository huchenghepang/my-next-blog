import { FC } from "react";
interface PageProps {
  // 这里是组件的属性
  params: Promise<{info: string[] | undefined}>
}

const PageProps: FC<PageProps> = async props => {
  const result = await props.params
  const {info} = result
  console.log(info)
  console.log(result)
  return (
    <div>
      <h2>page</h2>
      <p>这个是动态生成的页面。</p>
      {info?.map(item => {
        return <p key={item}>{item}</p>
      })}
    </div>
  )
}

export default PageProps;
