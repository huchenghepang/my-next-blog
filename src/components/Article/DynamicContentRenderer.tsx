import { HeadList } from "md-editor-rt";
import PreViewArticle from "../MyEditor/PreViewArticle";
import RichTextRenderer from "./RichTextRenderer";

interface TocItem {
  title: string;
  anchor: string;
  level?: number;
  [key: string]: any;
}

interface DynamicContentRendererProps {
  content: string;
  contentType: "markdown" | "richtext";
  slug: string;
  title: string;
  toc?: TocItem[];
}

// 将 API 的 TocItem 转换为 HeadList 格式（仅用于 Markdown）
const convertTocToHeadList = (toc?: TocItem[]): HeadList[] | undefined => {
  if (!toc) return undefined;
  return toc.map((item) => {
    // 确保 level 是有效的值
    const level =
      item.level && [1, 2, 3, 4, 5, 6].includes(item.level) ? item.level : 1;
    const line = parseInt(item.anchor.replace("header-", ""), 10) || 0;

    return {
      text: item.title,
      level: level as 1 | 2 | 3 | 4 | 5 | 6,
      line,
      children: [], // 如果需要嵌套结构，可以在这里处理
    };
  });
};

// 获取标题的 ID（仅用于 Markdown）
const getHeaderId = (
  level: number,
  toc: TocItem[] | undefined,
  text: string | undefined,
): string => {
  if (!toc) return "";
  const convertedToc = convertTocToHeadList(toc);
  const item = convertedToc?.find(
    (tocItem) => tocItem.level === level && tocItem.text === text,
  );
  return item ? `header-${item.line}` : "";
};

const DynamicContentRenderer: React.FC<DynamicContentRendererProps> = ({
  content,
  contentType,
  slug,
  title,
  toc,
}) => {
  // 渲染 Markdown 内容 - 完全支持服务端渲染
  const renderMarkdown = () => (
    <PreViewArticle slug={String(slug)} text={content || ""} title={title} />
  );

  // 渲染富文本内容 - 现在也支持服务端渲染
  const renderRichText = () => <RichTextRenderer content={content} />;

  return (
    <>{contentType === "markdown" ? renderMarkdown() : renderRichText()}</>
  );
};

export default DynamicContentRenderer;
