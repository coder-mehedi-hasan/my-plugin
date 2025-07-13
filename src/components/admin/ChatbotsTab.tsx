import React, { useState } from 'react';

type ChatbotConfig = {
    id: string;
    name: string;
    environment: string;
    model: string;
    context: string;
};

const ENVIRONMENTS = {
    OpenAI: ['gpt-3.5-turbo', 'gpt-4'],
    Claude: ['claude-3-opus', 'claude-3-haiku'],
    Mistral: ['mistral-small', 'mistral-medium'],
};

const defaultBot: ChatbotConfig = {
    id: 'default',
    name: 'Default Bot',
    environment: 'OpenAI',
    model: 'gpt-3.5-turbo',
    context: '',
};

export const ChatbotsTab = () => {
    const [bots, setBots] = useState<ChatbotConfig[]>([defaultBot]);
    const [activeId, setActiveId] = useState('default');

    const activeBot = bots.find(bot => bot.id === activeId)!;

    const updateBot = (changes: Partial<ChatbotConfig>) => {
        setBots(prev =>
            prev.map(bot =>
                bot.id === activeId ? { ...bot, ...changes } : bot
            )
        );
    };

    const addBot = () => {
        const newId = `bot${bots.length + 1}`;
        const newBot = {
            ...defaultBot,
            id: newId,
            name: `New Bot ${bots.length + 1}`,
        };
        setBots([...bots, newBot]);
        setActiveId(newId);
    };

    const deleteBot = () => {
        const filtered = bots.filter(bot => bot.id !== activeId);
        setBots(filtered);
        setActiveId(filtered[0]?.id || '');
    };

    const duplicateBot = () => {
        const newId = `${activeId}_copy`;
        const newBot = { ...activeBot, id: newId, name: `${activeBot.name} Copy` };
        setBots([...bots, newBot]);
        setActiveId(newId);
    };

    const resetBot = () => {
        updateBot({ ...defaultBot, id: activeId, name: activeBot.name });
    };

    return (
        <div>
            {/* Tabs for each bot */}
            <div className="flex space-x-2 mb-4">
                {bots.map(bot => (
                    <button
                        key={bot.id}
                        onClick={() => setActiveId(bot.id)}
                        className={`px-3 py-1 rounded border ${activeId === bot.id ? 'bg-blue-600 text-white' : 'bg-white'
                            }`}
                    >
                        {bot.name}
                    </button>
                ))}
                <button onClick={addBot} className="px-2 py-1 text-blue-600 border rounded">+ New Chatbot</button>
            </div>

            {/* Chatbot Configuration UI */}
            <div className="space-y-6 bg-white p-6 rounded shadow">
                <div>
                    <label className="block font-medium mb-1">Chatbot Name</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={activeBot.name}
                        onChange={e => updateBot({ name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Environment</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={activeBot.environment}
                            onChange={e =>
                                updateBot({
                                    environment: e.target.value,
                                    model: ENVIRONMENTS[e.target.value as keyof typeof ENVIRONMENTS][0],
                                })
                            }
                        >
                            {Object.keys(ENVIRONMENTS).map(env => (
                                <option key={env} value={env}>{env}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Model</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={activeBot.model}
                            onChange={e => updateBot({ model: e.target.value })}
                        >
                            {ENVIRONMENTS[activeBot.environment as keyof typeof ENVIRONMENTS].map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">Context</label>
                    <textarea
                        className="w-full border p-2 rounded min-h-[100px]"
                        value={activeBot.context}
                        onChange={e => updateBot({ context: e.target.value })}
                        placeholder="Enter custom instructions or background for this chatbot..."
                    />
                </div>

                <div className="text-sm text-gray-500">
                    Shortcode: <code className="bg-gray-100 px-2 py-1 rounded">[my_plugin_chatbot id="{activeBot.id}"]</code>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                    <button onClick={() => alert('Save logic')} className="bg-blue-600 text-white px-4 py-2 rounded">💾 Save</button>
                    <button onClick={duplicateBot} className="bg-yellow-500 text-white px-4 py-2 rounded">📄 Duplicate</button>
                    <button onClick={resetBot} className="bg-gray-300 px-4 py-2 rounded">🔁 Reset</button>
                    <button onClick={deleteBot} className="bg-red-600 text-white px-4 py-2 rounded">🗑 Delete</button>
                </div>
            </div>
        </div>
    );
};
