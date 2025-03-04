"use client";
import { ArticlesCategoryies, NotesWithTags } from "@/app/api/article/route";
import CategorySelectWithNoForm from "@/components/ArticleUploadForm/CategorySelect/CategorySelectWithNoForm";
import BubbleContainer from "@/components/Bubble/BubbleContainer";
import { Pagination as PaginationType } from "@/types/response";
import { fetcherClientCnm } from "@/utils/fetcher/fetcherCnm";
import { formatDateUTC } from "@/utils/format/formatDatetime";
import { Card, Pagination, Tag } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import "./page.scss";

const initailPagination = {
  page: 1,
  limit: 4,
  total: 0,
};

export default function ArticleList() {
  const [articlesList, setArticlesList] = useState<NotesWithTags[]>();
  // 查询参数请求
  const searchParams = useSearchParams();

  const [pagination, setPagination] =
    useState<PaginationType>(initailPagination);

  const categoryId = searchParams?.get("categoryid");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(Number(categoryId) || undefined);

  const reqArticles = useCallback(() => {
    const tagInfo = {
      id: Number(searchParams?.get("tagid")),
      name: searchParams?.get("tagname") || "",
    };


    fetcherClientCnm<ArticlesCategoryies>("/api/article", {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({
        pagination,
        categoryId: selectedCategoryId,
        tagInfo: tagInfo.id ? tagInfo : undefined,
      }),
    })
      .then(({ body }) => {
        if (body && body.data && body.data.articles) {
          setArticlesList(body.data.articles);
          setPagination((prevPagination) => ({
            ...prevPagination,
            total: body.data.pagination.totalCount || 1,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pagination, selectedCategoryId, searchParams]);

  useEffect(() => {
    reqArticles();
  }, [pagination.page, selectedCategoryId]); // 每次pagination变化时重新请求数据

  // 处理分页器变化
  const handlePageChange = (page: number, pageSize: number | undefined) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page,
      limit: pageSize || 4,
    }));
    // reqArticles();
  };

  const handleCategoryChange = useCallback((value: number) => {
    setSelectedCategoryId(value);
    setPagination(initailPagination);
    // reqArticles();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 dark:text-white">
      {/* 分类筛选 */}
      <div className="flex justify-between items-center  space-x-4">
        {/* 分类选择 */}
        <CategorySelectWithNoForm
          onChange={handleCategoryChange}
        ></CategorySelectWithNoForm>
      </div>

      {/* 文章列表 */}
      <div className="custom-scrollbar grid gap-1 h-[700px] overflow-y-auto">
        {articlesList && articlesList.length !== 0 ? (
          articlesList.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              className="w-full"
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                title={
                  <Link
                    href={`/posts/${article.id}`}
                    passHref
                    className="dark:text-white"
                  >
                    {article.name}
                  </Link>
                }
                variant="borderless"
                className="shadow-md dark:bg-gray-800 dark:text-white"
              >
                <p className="text-gray-600 w-full dark:text-gray-300 line-clamp-4">
                  {article.summary}
                </p>
                <div className="text-sm text-gray-400 mt-4 flex justify-between">
                  <span>{formatDateUTC(article.create_time)}</span>

                  <div className="flex items-center space-x-2">
                    {article.note_tags &&
                      article.note_tags.map((tag) => {
                        return (
                          <Tag
                            key={tag.tags.id}
                            className="text-gray-400 dark:text-slate-800"
                          >
                            {tag.tags.name}
                          </Tag>
                        );
                      })}
                  </div>

                  <span>
                    {article.reading} <BsEyeFill className="inline-block" />
                  </span>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-300">
            暂无相关文章
          </div>
        )}
      </div>

      {/* 分页 */}
      <div className="flex absolute justify-center left-1/2 transform -translate-x-1/2">
        {pagination.total && (
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            showSizeChanger={false}
            onChange={handlePageChange} // 调用分页更新函数
          />
        )}
      </div>
      <BubbleContainer></BubbleContainer>
    </div>
  );
}
