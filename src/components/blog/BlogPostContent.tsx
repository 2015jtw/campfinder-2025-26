'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-slate-700 dark:text-slate-300 leading-7 mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-6">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = Boolean(className?.includes('language-'))
    return isBlock ? (
      <code
        className={`${className ?? ''} block bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-sm overflow-x-auto mb-4 text-slate-800 dark:text-slate-200`}
      >
        {children}
      </code>
    ) : (
      <code className="bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 text-sm text-slate-800 dark:text-slate-200">
        {children}
      </code>
    )
  },
  pre: ({ children }) => <pre className="mb-4">{children}</pre>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-700 dark:hover:text-emerald-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-slate-200 dark:border-slate-700 my-6" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
}

export default function BlogPostContent({ content }: { content: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
