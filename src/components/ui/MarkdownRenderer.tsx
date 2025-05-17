import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 定制 Markdown 元素样式
        h1: ({...props}) => (
          <h1 className="text-lg font-bold my-2" {...props} />
        ),
        h2: ({...props}) => (
          <h2 className="text-md font-semibold my-2" {...props} />
        ),
        a: ({...props}) => (
          <a className="text-blue-500 hover:text-blue-600 dark:text-blue-400" {...props} />
        ),
        ul: ({...props}) => (
          <ul className="list-disc pl-4 my-2" {...props} />
        ),
        ol: ({...props}) => (
          <ol className="list-decimal pl-4 my-2" {...props} />
        ),
        table: ({...props}) => (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse my-2" {...props} />
          </div>
        ),
        blockquote: ({...props}) => (
          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}