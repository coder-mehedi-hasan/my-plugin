import { useState } from "react";
import useChatStream from "../../hooks/useChatStream";

export const ChatBar = () => {
    const chatbotId = 'default';
    // const chatbotId = window.MyPluginData.chatbotId || 'default';
    const { reply, isStreaming, error, sendPrompt, clear } = useChatStream(chatbotId);
    const [input, setInput] = useState('');

    const handleSubmit = () => {
        if (!input.trim()) return;
        clear();
        sendPrompt(input);
        setInput('');
    };

    return (
        <div className="bg-white p-4 rounded shadow w-full max-w-md">
            <h4 className="font-bold mb-2">AI Chat</h4>

            <div className="h-48 overflow-y-auto border p-2 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                {isStreaming ? <div className="animate-pulse text-gray-500">Typing...</div> : null}
                {reply && <div className="text-left">{reply}</div>}
                {error && <div className="text-red-500">{error}</div>}
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    className="flex-1 border p-2 rounded"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Type a query..."
                />
                <button
                    onClick={handleSubmit}
                    disabled={isStreaming}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
