import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

interface Props {
    content: string
    className?: string
}

const ChatMarkdownMessage: React.FC<Props> = ({ content, className }) => {
    const extractCodeString = (children: React.ReactNode): string => {
        if (typeof children === 'string') return children
        if (Array.isArray(children)) return children.map(child => {
            if (typeof child === 'string') return child
            if (typeof child === 'object' && 'props' in child && typeof child.props.children === 'string') {
                return child.props.children
            }
            return ''
        }).join('')
        return ''
    }

    return (
        <div className={`prose max-w-none text-sm ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ className, children, ...props }) {
                        return (
                            <div className="relative group">
                                <button
                                    onClick={async (event) => {
                                        navigator.clipboard.writeText(extractCodeString(children));
                                        event.currentTarget.innerText = "Copied!"
                                        await new Promise((resolve) => {
                                            setTimeout(resolve, 1000)
                                        });
                                        //@ts-ignore
                                        event.target.innerText = "Copy"
                                    }}
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
