import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

interface Props {
    content: string
    className?: string
}

const ChatMarkdownMessage: React.FC<Props> = ({ content, className }) => {
    return (
        <div className={`prose max-w-none text-sm ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ className, children, ...props }) {
                        console.log(props)
                        return (
                            <div className="relative group">
                                <button
                                    onClick={() => navigator.clipboard.writeText(children?.toString() as string)}
                                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded transition-all duration-200"
                                >
                                    Copy
                                </button>
                                <pre className="text-white rounded overflow-auto">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        )
                    },
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            {children}
                        </a>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div >
    )
}

export default ChatMarkdownMessage
