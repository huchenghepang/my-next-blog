"use client"
import {getPublicArticles} from "@/api/article"
import {FC, Suspense, useEffect, useState} from "react"
import Blog from "./Blog"

interface PageProps {
  params: Promise<{info: string[]}>
}

const Page: FC<PageProps> = props => {
  const [allNotes, setAllNotes] = useState<
    {
      id: string
      name: string
      summary?: string
      is_archive?: boolean
    }[]
  >([])

  useEffect(() => {
    // ✅ 在内部定义 async 函数
    const fetchData = async () => {
      const data = await getPublicArticles()
      const notes: {
        id: string
        name: string
        summary?: string
        is_archive?: boolean
      }[] = data.items.map((item, index) => ({
        id: item.public_id || index.toString(),
        name: item.title,
        summary: item.description,
        is_archive: item.is_archive,
      }))
      setAllNotes(notes)
    }

    fetchData()

    // 清理函数是可选的，这里不需要返回清理逻辑
    // 如果组件卸载时不需要清理，可以不写 return
  }, []) // 空依赖数组表示只在组件挂载时执行一次

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Blog notes={allNotes} />
    </Suspense>
  )
}

export default Page
