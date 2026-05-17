import React from "react";
import sanitizeHtml from "sanitize-html";

interface RichTextRendererProps {
  content: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
  // 使用 sanitize-html 进行服务端安全的 HTML 净化
  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "strike",
      "del",
      "ins",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "div",
      "span",
      "section",
      "article",
      "aside",
      "header",
      "footer",
      "nav",
      "ul",
      "ol",
      "li",
      "dl",
      "dt",
      "dd",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "caption",
      "blockquote",
      "q",
      "cite",
      "figure",
      "figcaption",
      "a",
      "img",
      "hr",
      "code",
      "pre",
      "samp",
      "kbd",
      "var",
      "mark",
      "small",
      "sub",
      "sup",
      "bdo",
      "ruby",
      "rt",
      "rp",
      "time",
      "data",
      "abbr",
      "address",
      "i",
      "b",
      "s",
      "font",
      "center",
      "blockquote",
      "pre",
      "iframe",
      "embed",
      "video",
      "audio",
      "canvas",
      "svg",
      "picture",
    ],
    allowedAttributes: {
      "*": ["class", "id", "style", "align", "title"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height", "title", "style"],
      table: ["border", "cellpadding", "cellspacing", "style"],
      td: ["colspan", "rowspan", "style"],
      th: ["colspan", "rowspan", "scope", "style"],
      iframe: [
        "src",
        "width",
        "height",
        "frameborder",
        "allowfullscreen",
        "title",
      ],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    parser: {
      lowerCaseAttributeNames: false,
    },
  });

  return (
    <div
      className="
        prose dark:prose-invert mx-auto max-w-5xl w-8/12 p-4 rounded-lg shadow-md
        max-md:w-full max-md:max-w-full max-md:pb-10
         text-black dark:text-[#c9d1d9]
        prose-base text-sm
        prose-p:my-0.5
        prose-headings:text-gray-900 dark:prose-headings:text-gray-200
        prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
        prose-img:max-w-full prose-img:rounded-lg
        prose-pre:bg-transparent prose-pre:shadow-none prose-pre:p-0 prose-pre:m-0
        prose-pre:text-base prose-code:text-sm
        [&_*]:break-words
        prose-h1:mb-4 prose-h2:mb-3 prose-h3:mb-2 prose-h4:mb-2 prose-h5:mb-1 prose-h6:mb-1
        prose-ul:my-2 prose-ol:my-2 prose-li:my-0
        prose-blockquote:my-4
      "
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichTextRenderer;
