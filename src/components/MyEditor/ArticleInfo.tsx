"use client";
import { CustomResponse } from "@/types/customResponse";
import { ArticleInfoResponse } from "@/types/response/article.r";
import { fetcherClientCnm } from "@/utils/fetcher/fetcherCnm";
import { formatDateUTC } from "@/utils/format/formatDatetime";
import { Tag } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";

interface ArticleInfoProps {
  articleId: string;
}

const ArticleInfo = ({ articleId }: ArticleInfoProps) => {
  const [articleInfo, setArticleInfo] = useState<ArticleInfoResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetcherClientCnm(`/api/article/${articleId}`)
      .then(({ success, body }) => {
        if (!success) setError("无法加载数据");
        const article = body as CustomResponse<ArticleInfoResponse>;
        setArticleInfo(article.data);
      })
      .catch((err) => {
        setError("无法加载数据");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [articleId]);

  if (loading) {
    return <p className="text-gray-500 text-sm">加载中...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  const handleClick = (id:number) => {
      router.push(`/article/tags/${id}`);
    };
  return (
    <div className="flex justify-between space-y-1 items-center clearfix border-t border-b">
      {/* 阅读量 */}
      <div className="flex items-center justify-center space-x-1 clearfix text-gray-600 ">
        <BsEye size={18} className="text-blue-500" />
        <span className="font-medium text-gray-700">
          {articleInfo?.reading}
        </span>
      </div>
      <div className="cursor-pointer flex flex-wrap gap-2">
        {articleInfo?.note_tags.map((tag, index) => {
          // 生成随机颜色（HSL 方式，让颜色更协调）
          const randomColor = `hsl(${(index * 60) % 360}, 70%, 70%)`;
          return (
            <Tag
              key={tag.tags.id}
              style={{ backgroundColor: randomColor, color: "white" }}
              onClick={() => handleClick(tag.tags.id)}
            >
              {tag.tags.name}
            </Tag>
          );
        })}
      </div>

      {/* 编辑时间 */}
      <div className="flex items-center justify-center clearfix  space-x-1 text-gray-600 ">
        <CiCalendarDate size={18} className="text-orange-500" />
        <span className="font-medium text-gray-700">
          {articleInfo?.updated_time
            ? formatDateUTC(articleInfo?.updated_time)
            : formatDateUTC(articleInfo?.create_time + "")}
        </span>
      </div>
    </div>
  );
};

export default ArticleInfo;
