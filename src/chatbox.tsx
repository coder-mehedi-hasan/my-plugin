import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MyPluginData } from './utils/constant';
import { ChatBar } from './components/common/Chatbox';

type Message = {
    role: 'user' | 'assistant' | any;
    content: string | any;
};

const chatbotId = 'default'; // ← Dynamically injected from shortcode or localized data




const Chatbox = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`${MyPluginData.apiUrl}my-plugin/v1/engine/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': MyPluginData.nonce,
                },
                body: JSON.stringify({
                    chatbotId,
                    prompt: input,
                }),
            });

            const data = await res.json();

            if (res.ok && data.reply) {
                setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: '⚠️ Failed to respond.' }]);
            }
        } catch (err: any) {
            setMessages([...newMessages, { role: 'assistant', content: `❌ ${err.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return <ChatBar />

    return (
        <div className="bg-white p-4 rounded shadow-lg border w-full max-w-md mx-auto">
            <h4 className="font-bold mb-3">AI Chat</h4>
            <div className="h-48 overflow-y-auto border p-2 mb-2 space-y-2 text-sm bg-gray-50 rounded">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                        <div
                            className={`inline-block px-3 py-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="text-left text-gray-500 text-sm italic">Thinking...</div>
                )}
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-1 border p-2 rounded"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleEnter}
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

const rootEl = document.getElementById('my-plugin-chatbox-root');
if (rootEl) {
    const root = createRoot(rootEl);
    root.render(<Chatbox />);
}
