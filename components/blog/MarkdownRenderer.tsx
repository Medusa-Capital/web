"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4 text-white font-heading">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-white font-heading">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-white">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg md:text-xl font-semibold mt-4 mb-2 text-white">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-[#B9B8EB]/80 leading-relaxed mb-4">{children}</p>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-[#657ef3] hover:text-[#8da0f5] hover:underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-[#B9B8EB]/80">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-[#B9B8EB]/80">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[#657ef3] pl-4 italic my-6 text-[#B9B8EB]/70">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-[#B9B8EB]">
                {children}
              </code>
            );
          }
          return (
            <code className={`${className} font-mono text-[#B9B8EB]`}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-[#1b1a64]/50 p-4 rounded-xl overflow-x-auto mb-6 border border-[#B9B8EB]/10">
            {children}
          </pre>
        ),
        img: ({ src, alt }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ""}
            className="rounded-xl my-6 max-w-full h-auto"
          />
        ),
        hr: () => <hr className="my-8 border-[#B9B8EB]/20" />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-[#B9B8EB]/20 rounded-xl overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[#1b1a64]/50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 border-b border-[#B9B8EB]/20 text-left font-semibold text-white">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 border-b border-[#B9B8EB]/10 text-[#B9B8EB]/80">
            {children}
          </td>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
