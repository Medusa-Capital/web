"use client";

import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (!isValidElement(node)) {
    if (Array.isArray(node)) return node.map(extractText).join("");
    return "";
  }
  const props = node.props as Record<string, unknown>;
  return extractText(props.children as ReactNode);
}

function containsLink(node: ReactNode): boolean {
  if (!isValidElement(node)) {
    if (Array.isArray(node)) return node.some(containsLink);
    return false;
  }
  if (typeof node.type === "string" && node.type === "a") return true;
  const props = node.props as Record<string, unknown>;
  const children = props.children as ReactNode;
  if (Array.isArray(children)) return children.some(containsLink);
  return containsLink(children);
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
        blockquote: ({ children }) => {
          // Detect CTA blockquotes: contain a link (typically lead magnet / download CTAs from Notion)
          const text = extractText(children);
          const hasLink = containsLink(children);
          if (hasLink) {
            return (
              <div className="my-8 rounded-2xl border border-[#6366f1]/30 bg-[#1b1a64]/60 p-6 text-center backdrop-blur-sm">
                <div className="text-[#B9B8EB]/90 [&>p]:mb-2 [&>p:last-child]:mb-0 [&_a]:inline-block [&_a]:mt-2 [&_a]:rounded-lg [&_a]:bg-[#6366f1] [&_a]:px-6 [&_a]:py-2.5 [&_a]:text-sm [&_a]:font-semibold [&_a]:text-white [&_a]:no-underline [&_a]:transition-colors hover:[&_a]:bg-[#818cf8]">
                  {children}
                </div>
              </div>
            );
          }
          return (
            <blockquote className="border-l-4 border-[#657ef3] pl-4 italic my-6 text-[#B9B8EB]/70">
              {children}
            </blockquote>
          );
        },
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
          <figure className="my-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt || ""}
              className="rounded-xl max-w-full h-auto"
            />
            {alt && (
              <figcaption className="text-center text-sm text-[#B9B8EB]/50 mt-2">
                {alt}
              </figcaption>
            )}
          </figure>
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
