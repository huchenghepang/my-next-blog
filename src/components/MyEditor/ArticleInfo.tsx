"use client";
import { ArticleInfoSimple } from "@/app/api/article/slug/route";
import { CustomResponse } from "@/types/customResponse";
import { fetcherClientCnm } from "@/utils/fetcher/fetcherCnm";
import { formatDateUTC } from "@/utils/format/formatDatetime";
import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";

interface ArticleInfoProps {
  slug: string;
}

const ArticleInfo = ({ slug }: ArticleInfoProps) => {
  const [articleInfo, setArticleInfo] = useState<ArticleInfoSimple | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();
  useEffect(() => {
    fetcherClientCnm(`/api/article/slug?slug=${slug}`)
      .then(({ success, body }) => {
        if (!success) setError("无法加载数据");
        const article = body as CustomResponse<ArticleInfoSimple>;
        setArticleInfo(article.data);
      })
      .catch((err) => {
        setError("无法加载数据");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <p className="text-gray-500 text-sm">加载中...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  return (
    <div className="flex justify-between space-y-1 items-center clearfix border-t border-b">
      {/* 阅读量 */}
      <div className="flex items-center justify-center space-x-1 clearfix text-gray-600 ">
        <BsEye size={18} className="text-blue-500" />
        <span className="font-medium text-gray-700">
          {articleInfo?.reading}
        </span>
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
