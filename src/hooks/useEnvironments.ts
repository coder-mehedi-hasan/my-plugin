import { useEffect, useState } from 'react';
import { EnvironmentConfig } from '../types/types';
import { MyPluginData } from '../utils/constant';

const useEnvironments = () => {
    const [environments, setEnvironments] = useState<EnvironmentConfig[]>([]);

    const getEnvironements = async () => {
        await fetch(`${MyPluginData.apiUrl}my-plugin/v1/environments`, {
            headers: {
                'X-WP-Nonce': MyPluginData.nonce,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEnvironments(data);
                }
            });
    }

    useEffect(() => {
        getEnvironements();
        return () => {
            setEnvironments([]);
        }
    }, []);


    return {
        environments,
        refetch: getEnvironements,
        setEnvironments
    };
};

export default useEnvironments;