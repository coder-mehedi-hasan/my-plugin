import { useEffect, useState } from 'react';
import { EnvironmentConfig } from '../types/types';

export default function useModels(environment: EnvironmentConfig | null) {
    const [models, setModels] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log(environment)
    useEffect(() => {
        if (!environment) return;

        setLoading(true);
        setError(null);

        fetch(`${window.MyPluginData.apiUrl}my-plugin/v1/engine/models`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': window.MyPluginData.nonce,
            },
            body: JSON.stringify({ type: environment.type, apiKey: environment.apiKey, baseUrl: environment.baseUrl }),
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setModels(data.map(m => m.id || m)); // handle OpenRouter vs others
                } else if (data?.message) {
                    setError(data.message);
                }
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [environment]);

    return { models, loading, error };
}
