import { memo, useEffect, useRef, useState } from 'react';
import ChatMarkdownMessage from '../ChatMarkdownMessage';

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

const Chatbox = ({ ...props }) => {
    const chatbotId = props?.botId;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem(`chatbot-history-${chatbotId}`);
        if (saved) setMessages(JSON.parse(saved));
    }, [chatbotId]);

    useEffect(() => {
        localStorage.setItem(`chatbot-history-${chatbotId}`, JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
    };

    const sendPrompt = async () => {
        const prompt = input.trim();
        if (!prompt || isStreaming) return;

        const updated = [...messages, { role: 'user', content: prompt }];
        //@ts-ignore
        setMessages(updated);
        setInput('');
        setError(null);
        setIsStreaming(true);

        try {
            const res = await fetch(`${window.MyPluginData.apiUrl}my-plugin/v1/engine/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.MyPluginData.nonce,
                },
                body: JSON.stringify({
                    chatbotId,
                    messages: updated,
                    prompt
                }),
            });

            if (!res.body) throw new Error('No stream response');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let assistantReply = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                chunk
                    .split('\n')
                    .filter(line => line.startsWith('data: '))
                    .forEach(line => {
                        const json = line.replace('data: ', '').trim();
                        if (json === '[DONE]') return;

                        try {
                            const parsed = JSON.parse(json);
                            const content = parsed?.choices?.[0]?.delta?.content;
                            if (content) {
                                assistantReply += content;
                                setMessages(prev => {
                                    const temp = [...prev];
                                    const last = temp[temp.length - 1];
                                    if (last?.role === 'assistant') {
                                        temp[temp.length - 1] = { role: 'assistant', content: last.content + content };
                                    } else {
                                        temp.push({ role: 'assistant', content });
                                    }
                                    return [...temp];
                                });
                            }
                        } catch { }
                    });
            }
        } catch (err: any) {
            setError(err.message || 'Stream failed');
        } finally {
            setIsStreaming(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPrompt();
        }
    };

    const clearHistory = () => {
        localStorage.removeItem(`chatbot-history-${chatbotId}`);
        setMessages([]);
    };

    return (
        <div className="bg-white p-4 rounded shadow-lg border w-full mx-auto text-sm">
            {/* <h4 className="font-bold text-lg mb-2">AI Chat</h4> */}

            <div className="h-64 overflow-y-auto bg-gray-50 p-3 rounded space-y-3">
                {messages.map((msg, i) => {
                    const isBot = msg?.role === "assistant";
                    return isBot ?
                        <ChatMarkdownMessage content={msg?.content} key={msg.role + i}></ChatMarkdownMessage>
                        : (
                            <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                                <div
                                    className={`inline-block px-3 py-2 rounded max-w-[90%] ${msg.role === 'user'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        )
                })}
                {isStreaming && (
                    <div className="text-gray-400 italic">Assistant is typing...</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex mt-3 gap-2">
                <input
                    className="flex-1 border p-2 rounded"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={isStreaming}
                />
                <button
                    onClick={sendPrompt}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={isStreaming}
                >
                    Send
                </button>
            </div>

            {error && (
                <div className="text-red-500 text-xs mt-2">⚠️ {error}</div>
            )}

            <div className="text-xs text-right mt-2">
                <button onClick={clearHistory} className="text-red-500 underline">
                    🗑 Clear History
                </button>
            </div>
        </div>
    );
};

export default memo(Chatbox);
