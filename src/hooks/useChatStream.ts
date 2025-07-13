import { useState } from 'react';

export default function useChatStream(chatbotId: string) {
    const [reply, setReply] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendPrompt = async (prompt: string) => {
        setReply('');
        setError(null);
        setIsStreaming(true);

        try {
            const res = await fetch(`${window.MyPluginData.apiUrl}my-plugin/v1/engine/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.MyPluginData.nonce,
                },
                body: JSON.stringify({ chatbotId, prompt }),
            });

            if (!res.body) {
                setError('No response stream.');
                setIsStreaming(false);
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

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
                                setReply(prev => prev + content);
                            }
                        } catch (e) {
                            console.error('Stream JSON parse error:', e);
                        }
                    });
            }
        } catch (err: any) {
            setError(err.message || 'Unknown stream error.');
        } finally {
            setIsStreaming(false);
        }
    };

    return {
        reply,
        isStreaming,
        error,
        sendPrompt,
        clear: () => setReply(''),
    };
}
