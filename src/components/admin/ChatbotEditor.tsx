import React from 'react';
import useModels from '../../hooks/useModels';
import { EnvironmentConfig } from '../../types/types';


type ChatbotConfig = {
    id: string;
    name: string;
    environment: EnvironmentConfig | null;
    model: string;
    context: string;
};

type Props = {
    bot: ChatbotConfig;
    environments: EnvironmentConfig[];
    updateBot: (changes: Partial<ChatbotConfig>) => void;
    onDuplicate: () => void;
    onReset: () => void;
    onDelete: () => void;
    onSave: () => void;
};

const ChatbotEditor: React.FC<Props> = ({
    bot,
    environments,
    updateBot,
    onDuplicate,
    onReset,
    onDelete,
    onSave,
}) => {
    const selectedEnv = environments.find(env => env.name === bot.environment?.name);
    const { models, loading, error } = useModels(selectedEnv || null);

    return (
        <div className="space-y-6 bg-white p-6 rounded shadow">
            <div>
                <label className="block font-medium mb-1">Chatbot Name</label>
                <input
                    className="w-full border p-2 rounded"
                    value={bot.name}
                    onChange={e => updateBot({ name: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium mb-1">Environment</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={bot.environment?.name || ''}
                        onChange={e => {
                            const newEnv = environments.find(env => env.name === e.target.value);
                            updateBot({ environment: newEnv || null, model: '' });
                        }}
                    >
                        <option value="">Select Environment</option>
                        {environments.map(env => (
                            <option key={env.id} value={env.name}>
                                {env.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">Model</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={bot.model}
                        onChange={e => updateBot({ model: e.target.value })}
                        disabled={loading || !models.length}
                    >
                        {loading && <option>Loading models...</option>}
                        {models.map(model => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
            </div>

            <div>
                <label className="block font-medium mb-1">Context</label>
                <textarea
                    className="w-full border p-2 rounded min-h-[100px]"
                    value={bot.context}
                    onChange={e => updateBot({ context: e.target.value })}
                    placeholder="Enter custom instructions or background for this chatbot..."
                />
            </div>

            <div className="text-sm text-gray-500">
                Shortcode:{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                    [my_plugin_chatbox id="{bot.id}"]
                </code>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
                <button onClick={onDuplicate} className="bg-yellow-500 text-white px-4 py-2 rounded">
                    📄 Duplicate
                </button>
                <button onClick={onReset} className="bg-gray-300 px-4 py-2 rounded">
                    🔁 Reset
                </button>
                <button onClick={onDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                    🗑 Delete
                </button>
                <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded">
                    💾 Save
                </button>
            </div>
        </div>
    );
};

export default ChatbotEditor;
