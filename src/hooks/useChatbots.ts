import { useEffect, useState } from 'react';
import { ChatbotConfig } from '../types/types';
import { MyPluginData } from '../utils/constant';

const useChatbots = () => {
    const [chatbots, setChatbots] = useState<ChatbotConfig[]>([]);

    const getChatbots = async () => {
        fetch(`${MyPluginData.apiUrl}my-plugin/v1/chatbots`, {
            headers: {
                'X-WP-Nonce': MyPluginData.nonce,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    console.log(data)
                    setChatbots(data);
                }
            });
    }

    useEffect(() => {
        getChatbots();
        return () => {
            setChatbots([]);
        }
    }, []);


    return {
        chatbots,
        refetch: getChatbots,
        setChatbots
    };
};

export default useChatbots;