import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";

interface ArticleInfoProps {
  articleId: string;
}

const ArticleInfo = ({ articleId }: ArticleInfoProps) => {
  const [title, setTitle] = useState<string | null>(null);
  const [views, setViews] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${articleId}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setViews(data.views || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("加载失败");
        setLoading(false);
      });
  }, [articleId]);

  if (loading) {
    return <p className="text-gray-500 text-sm">加载中...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  return (
    <div className="flex flex-col space-y-1">
      {/* 文章标题 */}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      {/* 阅读量 */}
      <div className="flex items-center space-x-1 text-gray-600 text-sm">
        <BsEye size={18} className="text-gray-500" />
        <span className="font-medium text-gray-700">
          {views !== null ? views : "--"}
        </span>
      </div>
    </div>
  );
};

export default ArticleInfo;
