"use client";

import { memo } from "react";
import { Options } from "react-markdown";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { v4 as uuidv4 } from "uuid";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "./CodeBlock";

const Markdown: React.FC<Options> = memo((options) => {
  return (
    <ReactMarkdown
      {...options}
      className="prose dark:prose-invert"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline ? (
            <CodeBlock
              key={uuidv4()}
              language={(match && match[1]) || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <table className="border-collapse border border-black px-3 py-1 dark:border-white">
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="break-words border border-black px-3 py-1 dark:border-white">
              {children}
            </td>
          );
        },
      }}
    />
  );
});

Markdown.displayName = "Markdown";

export default Markdown;
