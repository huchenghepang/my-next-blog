"use client";
import { CreateArticleParams } from "@/types/params/article";
import { DatePicker, Form, Input, Modal, Select, Switch } from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import TextArea from "antd/es/input/TextArea";
import { HeadList } from "md-editor-rt";
import CategorySelect from "./CategorySelect/CategorySelect";

interface ArticleUploadFormProps {
  isShow: boolean;
  onClose: () => void;
  onSubmit: (data: CreateArticleParams) => void;
  content: string;
  directory: HeadList[];
  title?: string;
}

const ArticleUploadForm: React.FC<ArticleUploadFormProps> = ({
  isShow,
  onClose,
  onSubmit,
  content,
  directory,
  title = "上传文章",
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, content, directory });
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  return (
    <Modal
      title={title}
      open={isShow}
      onCancel={onClose}
      onOk={handleOk}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        {/* 文章标题 */}
        <Form.Item
          label="文章标题"
          name="title"
          rules={[{ required: true, message: "请输入文章标题" }]}
        >
          <Input placeholder="请输入文章标题" />
        </Form.Item>
        <Form.Item
          label="文章摘要"
          name="summary"
          rules={[{ message: "请输入文章摘要" }]}
        >
          <TextArea placeholder="请输入文章摘要" />
        </Form.Item>

        {/* 创建时间 */}
        <Form.Item
          label="创建时间"
          name="createdAt"
          rules={[{ required: true, message: "请选择创建时间" }]}
        >
          <DatePicker style={{ width: "100%" }} showTime locale={locale} />
        </Form.Item>

        {/* 文章分类 */}
        <CategorySelect></CategorySelect>

        {/* 标签 */}
        <Form.Item label="标签" name="tags">
          <Select mode="tags" placeholder="输入标签" allowClear></Select>
        </Form.Item>
        {/* 是否归档 */}
        <Form.Item label="是否归档" name="isArchived" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticleUploadForm;
