import { ReactNode } from "react";
import {
  Article,
  BreadcrumbList,
  ItemList,
  WebSite,
  WithContext,
} from "schema-dts";

// 定义支持的 Schema 类型
type SupportedSchema =
  | WithContext<Article>
  | WithContext<BreadcrumbList>
  | WithContext<WebSite>
  | WithContext<ItemList>
  | WithContext<any>; // 兜底类型

interface JsonLdProps {
  data: SupportedSchema | SupportedSchema[];
  children?: ReactNode;
}

export default function JsonLd({ data, children }: JsonLdProps) {
  const jsonData = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      {children}
    </>
  );
}
