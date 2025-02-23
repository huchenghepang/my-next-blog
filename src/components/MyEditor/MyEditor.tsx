"use client";
import { UploadResponse } from "@/app/api/upload/route";
import { CustomResponse } from "@/types/customResponse";
import { CreateArticleParams } from "@/types/params/article";
import { fetcherClient } from "@/utils/fetcher/fetcherClient";
import type { EditorProps, HeadList } from "md-editor-rt";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import React, { useState } from "react";
import ArticleUploadForm from "../ArticleUploadForm/ArticleUploadForm";
import { showMessage } from "../Message/MessageManager";
import "./my-editor.scss";

async function reqCreateArticle(data: CreateArticleParams) {
  const { success } = await fetcherClient("/api/article/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

const MyEditor: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const upLoadImg: EditorProps["onUploadImg"] = async (files, callBack) => {
    try {
      const formData = new FormData();
      formData.append("file", files[0], files[0].name);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const {
        success,
        errorMessage,
        data: {
          accessUrl,
          fileInfo: { file_fullname, file_type },
        },
      } = (await res.json()) as CustomResponse<UploadResponse>;
      if (!success)
        return showMessage({
          type: "error",
          text: errorMessage || "上传图片失败",
        });
      if (success) showMessage({ type: "success", text: "图片上传成功" });
      callBack([{ url: accessUrl, title: file_fullname, alt: file_type }]);
    } catch (error) {
      showMessage({ type: "error", text: "上传图片失败" });
    }
  };
  const [catalogList, setList] = useState<HeadList[]>([]);
  const getCatalog: EditorProps["onGetCatalog"] = (list) => {
    setList(list);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div>
      <MdEditor
        previewTheme="github"
        className="w-full"
        placeholder="请在这里输入内容"
        value={value}
        onUploadImg={upLoadImg}
        onChange={(val) => setValue(val)}
        htmlPreview
        onSave={() => setIsModalVisible(true)}
        onGetCatalog={getCatalog}
      />
      <ArticleUploadForm
        isShow={isModalVisible}
        title="编辑文章"
        onClose={() => setIsModalVisible(false)}
        onSubmit={(data) => {
          reqCreateArticle(data);
          setIsModalVisible(false);
        }}
        content={value}
        directory={catalogList}
      />
      <div className="relative w-full  bg-gray-100">
        <button 
        onClick={()=>setValue("")}
        className="absolute right-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 active:bg-red-700">
          清空文章
        </button>
      </div>
    </div>
  );
};

export default MyEditor;
