import { HeadList } from "md-editor-rt";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // 允许解析 Markdown 里的 HTML
import remarkGfm from "remark-gfm"; // 让 Markdown 支持表格、删除线等
import CodeBlock from "./CodeBlock/CodeBlock";
import MyImageComponent from "./MyImage";
import { BsEye } from "react-icons/bs";

interface PreViewArticleProps {
  id: string;
  text: string;
  toc: HeadList[] | undefined;
  author?:string;
  reading?:number;
}

function getHeaderId(
  level: number,
  toc: HeadList[] | undefined,
  text: string | undefined,
): string {
  if (!toc) return "";
  const item = toc.find(
    (tocItem) => tocItem.level === level && tocItem.text === text
  );
  return item ? `header-${item.line}` : "";
}

export default function PreViewArticle({
  id,
  text,
  toc,
  author,
  reading,
}: PreViewArticleProps) {
  return (
    <div
      className="
      prose dark:prose-invert mx-auto  max-w-4xl p-4 rounded-lg shadow-md
    bg-white dark:bg-[#0d1117] text-black dark:text-[#c9d1d9]
      prose-base text-sm
      prose-p:my-0.5
    prose-headings:text-gray-900 dark:prose-headings:text-gray-200
    prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
      prose-img:max-w-full prose-img:rounded-lg
      prose-pre:bg-transparent prose-pre:shadow-none prose-pre:p-0 prose-pre:m-0
      prose-pre:text-base prose-code:text-sm
      "
    >
      <ReactMarkdown
        key={id}
        rehypePlugins={[rehypeRaw]} // 允许解析 HTML
        remarkPlugins={[remarkGfm]} // 让 Markdown 支持表格、删除线等
        components={{
          code(params: any) {
            return <CodeBlock {...params}></CodeBlock>;
          },
          img({ src, alt }) {
            return <MyImageComponent src={src} alt={alt} />;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-500 pl-4 italic opacity-80">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300">
                  {children}
                </table>
              </div>
            );
          },
          h1: ({ node, children }) => {
            // 获取该标题所在行号
            const id = getHeaderId(1, toc, children?.toString());
            return id.endsWith("0") ? (
              <h1 id={id} className={`text-3xl  flex justify-center`}>
                <span className="font-extrabold bg-gradient-to-r from-purple-400 to-yellow-700 bg-clip-text text-transparent">
                  {children}
                </span>
              </h1>
            ) : (
              <h1
                id={id}
                className="text-3xl font-extrabold mt-8 mb-4 text-blue-600"
              >
                {children}
              </h1>
            );
          },
          h2: ({ node, children }) => {
            // 获取该标题所在行号
            const id = getHeaderId(2, toc, children?.toString());
            return (
              <h2 id={id} className="text-2xl font-bold mt-6 mb-3">
                {children}
              </h2>
            );
          },
          h3: ({ node, children }) => {
            // 获取该标题所在行号
            const id = getHeaderId(3, toc, children?.toString());
            return (
              <h3 id={id} className="text-xl font-semibold mt-5 mb-2">
                {children}
              </h3>
            );
          },
          h4: ({ node, children }) => {
            // 获取该标题所在行号
            const id = getHeaderId(4, toc, children?.toString());
            return (
              <h4 id={id} className="text-lg font-semibold mt-4 mb-2">
                {children}
              </h4>
            );
          },
          h5: ({ node, children }) => {
            // 获取该标题所在行号
            const id = getHeaderId(5, toc, children?.toString());
            return (
              <h5 id={id} className="text-base font-medium mt-3 mb-1">
                {children}
              </h5>
            );
          },
          h6: ({ node, children }) => {
            // 获取该标题所在行号
            const id = getHeaderId(6, toc, children?.toString());
            return (
              <h6 id={id} className="text-sm font-medium mt-2 mb-1">
                {children}
              </h6>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
      <p className="flex  align-center">
        <BsEye size={20} alignmentBaseline="middle"></BsEye>:{reading}
      </p>
    </div>
  );
}
