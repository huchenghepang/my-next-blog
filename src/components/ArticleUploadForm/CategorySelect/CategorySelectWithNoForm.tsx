"use client";
import { CategoryList, CategoryRows } from "@/types/response/category.r";
import { fetcherClientCnm } from "@/utils/fetcher/fetcherCnm";
import { Select, message } from "antd";
import React, { useEffect, useState } from "react";

const { Option, OptGroup } = Select;

// 定义 Props 类型
interface CategorySelectProps {
  onChange?: (value: number) => void; // 选中分类后的回调
  defaultValue?: number; // 默认选中的分类
}

const CategorySelectWithNoForm: React.FC<CategorySelectProps> = ({
  onChange,
  defaultValue,
}) => {
  const [categories, setCategories] = useState<CategoryList>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // 请求分类数据
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { success, body } = await fetcherClientCnm<CategoryRows>(
        "/api/article/category"
      ); // 根据你的 API 修改
      if (success && body) {
        const { data } = body;
        setCategories(data);
      }
    } catch (error) {
      message.error("请求分类数据出错");
    } finally {
      setLoading(false);
    }
  };

  // 按父分类进行分组
  const categoryGroups = categories.reduce((acc, cat) => {
    if (cat.parent_id === null) {
      acc[cat.id] = { ...cat, children: [] };
    } else {
      acc[cat.parent_id]?.children.push(cat);
    }
    return acc;
  }, {} as Record<number, { id: number; name: string; parent_id: number | null; children: any[] }>);

  return (
    <Select
      placeholder="请选择分类"
      loading={loading}
      style={{ width: "200px" }}
      onChange={onChange} // 触发外部行为
      defaultValue={defaultValue} // 默认选中值
    >
      {Object.values(categoryGroups).map((parent) =>
        parent.children.length > 0 ? (
          <OptGroup key={parent.id} label={parent.name}>
            {parent.children.map((child) => (
              <Option key={child.id} value={child.id}>
                {child.name}
              </Option>
            ))}
          </OptGroup>
        ) : (
          <Option key={parent.id} value={parent.id}>
            {parent.name}
          </Option>
        )
      )}
    </Select>
  );
};

export default CategorySelectWithNoForm;
