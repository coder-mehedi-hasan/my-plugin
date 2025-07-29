import { useEffect, useState } from 'react';
import useEnvironments from '../../hooks/useEnvironments';
import { ChatbotConfig } from '../../types/types';
import { get, remove } from '../../utils/api';
import { MyPluginData } from '../../utils/constant';
import ChatbotEditor from './ChatbotEditor';
import endpoints from '../../utils/endpoints';
import toast from 'react-hot-toast';
import { generateRandomString } from '../../utils/helper';

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
        const newId = `bot-${generateRandomString(10)}`;
        const newBot = {
            ...defaultBot,
            id: newId,
            name: `New Bot ${bots.length + 1}`,
        };
        setBots([...bots, newBot]);
        setActiveId(newId);
    };

    const deleteBot = async () => {
        try {
            await remove(endpoints.chatbots.byId(activeId));
            toast.success("Bot deleted!")
        } catch (error: any) {
            console.log("Error to delete bot! ", error?.response?.data);
            toast.error(error?.response?.data?.message);
        }
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
        get(endpoints.chatbots.base)
            .then(data => {
                if (Array.isArray(data?.data) && data?.data.length > 0) {
                    setBots(data?.data);
                    setActiveId(data?.data[0].id);
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
                if (res.success) toast.success('Chatbots saved successfully');
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
