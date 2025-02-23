"use client";
import type { UploadProps } from "antd";
import { Button, Upload } from "antd";
import React from "react";

const props: UploadProps = {
  name: "file",
  action: "http://localhost:4000/api/upload",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
    }
    if (info.file.status === "done") {
    } else if (info.file.status === "error") {
    }
  },
};

const UploadButton: React.FC = () => (
  <Upload {...props}>
    <Button>上传文件</Button>
  </Upload>
);

export default UploadButton;
