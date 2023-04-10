"use client";

import { memo, useState } from "react";
import { FaCheck, FaClipboard } from "react-icons/fa";
import { Prism } from "react-syntax-highlighter";

import { materialDark as highlightTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
interface ICodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock: React.FC<ICodeBlockProps> = memo(
  ({ language, value }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        return;
      }

      navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      });
    };

    return (
      <div className="relative font-sans text-sm">
        <div className="flex items-center justify-between px-4 py-1.5">
          <span className="text-xs lowercase text-white">{language}</span>

          <div className="flex items-center">
            <button
              className="flex items-center gap-1.5 rounded bg-none p-1 text-xs text-white"
              onClick={copyToClipboard}
            >
              {isCopied ? <FaCheck size="18" /> : <FaClipboard size="18" />}
              {isCopied ? "Copied" : "Copy Code"}
            </button>
          </div>
        </div>

        <Prism
          language={language}
          style={highlightTheme}
          customStyle={{ margin: 0 }}
        >
          {value}
        </Prism>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";
