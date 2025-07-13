import { useEffect, useState } from 'react';
import { MyPluginData } from '../../utils/constant';
import useEnvironments from '../../hooks/useEnvironments';
import useModels from '../../hooks/useModels';
import ChatbotEditor from './ChatbotEditor';

type ChatbotConfig = {
    id: string;
    name: string;
    environment: any;
    model: string;
    context: string;
};

const defaultBot: ChatbotConfig = {
    id: 'default',
    name: 'Default Bot',
    environment: null,
    model: 'gpt-3.5-turbo',
    context: '',
};

export const ChatbotsTab = () => {
    const [bots, setBots] = useState<ChatbotConfig[]>([defaultBot]);
    const [activeId, setActiveId] = useState('default');
    const { environments } = useEnvironments();

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

    useEffect(() => {
        fetch(`${MyPluginData.apiUrl}my-plugin/v1/chatbots`, {
            headers: {
                'X-WP-Nonce': MyPluginData.nonce,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setBots(data);
                    setActiveId(data[0].id);
                }
            });
    }, []);


    const saveBots = () => {
        fetch(`${MyPluginData.apiUrl}my-plugin/v1/chatbots`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': MyPluginData.nonce,
            },
            body: JSON.stringify(bots),
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) alert('Chatbots saved successfully');
            });
    };

    return (
        <div>
            <div className="flex space-x-2 mb-4">
                {bots.map(bot => (
                    <button
                        key={bot.id}
                        onClick={() => setActiveId(bot.id)}
                        className={`px-3 py-1 rounded border ${activeId === bot.id ? 'bg-blue-600 text-white' : 'bg-white'}`}
                    >
                        {bot.name}
                    </button>
                ))}
                <button onClick={addBot} className="px-2 py-1 text-blue-600 border rounded">
                    + New Chatbot
                </button>
            </div>

            <ChatbotEditor
                bot={activeBot}
                environments={environments}
                updateBot={updateBot}
                onDuplicate={duplicateBot}
                onReset={resetBot}
                onDelete={deleteBot}
                onSave={saveBots}
            />
        </div>
    );

};
