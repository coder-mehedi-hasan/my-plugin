import { useEffect, useState } from "react";
import { MyPluginData } from "../../utils/constant";
import useEnvironments from "../../hooks/useEnvironments";

export const SettingsTab = () => {
    const { environments, refetch, setEnvironments } = useEnvironments();
    const [activeEnvId, setActiveEnvId] = useState<string | null>(null);

    const types = [
        'OpenAI',
        'Anthropic',
        'Azure (OpenAI)',
        'Google',
        'OpenRouter',
        'Hugging Face',
        'Replicate',
        'Perplexity',
    ];

    const updateEnv = (field: string, value: string) => {
        // setEnvironments(prev =>
        //     prev.map(env =>
        //         env.id === activeEnvId ? { ...env, [field]: value } : env
        //     )
        // );
    };

    const addEnvironment = () => {
        const newId = `env_${Date.now()}`;
        setEnvironments([
            ...environments,
            { id: newId, name: '', type: 'OpenAI', apiKey: '' },
        ]);
        setActiveEnvId(newId);
    };

    const deleteEnvironment = () => {
        // const filtered = environments.filter(env => env.id !== activeEnvId);
        // setEnvironments(filtered);
        // setActiveEnvId(filtered[0]?.id || '');
    };

    useEffect(() => {
        if (!activeEnvId && environments?.length) {
            setActiveEnvId(environments[0]?.id)
        }
    }, [environments])

    const env = environments.find(e => e.id === activeEnvId);

    const saveToServer = () => {
        fetch(`${MyPluginData.apiUrl}my-plugin/v1/environments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': MyPluginData.nonce,
            },
            body: JSON.stringify(environments),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Environments saved successfully!');
                } else {
                    alert('Failed to save.');
                }
            });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left panel with environment form */}
            <div className="flex-1 space-y-4 bg-white p-6 rounded shadow">
                {/* Tabs */}
                <div className="flex space-x-2 mb-4">
                    {environments.map(e => (
                        <button
                            key={e.id}
                            onClick={() => setActiveEnvId(e.id)}
                            className={`px-4 py-1 rounded ${activeEnvId === e.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {e.name || 'New'}
                        </button>
                    ))}
                    <button
                        onClick={addEnvironment}
                        className="px-3 py-1 text-blue-600 border rounded"
                    >
                        + New Environment
                    </button>
                </div>

                {/* Environment Form */}
                {env && (
                    <>
                        <div>
                            <label className="block font-semibold mb-1">Name</label>
                            <input
                                className="w-full border p-2 rounded"
                                value={env.name}
                                onChange={e => updateEnv('name', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-1">Type</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={env.type}
                                onChange={e => updateEnv('type', e.target.value)}
                            >
                                {types.map(type => (
                                    <option key={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold mb-1">API Key</label>
                            <input
                                className="w-full border p-2 rounded"
                                type="password"
                                value={env.apiKey}
                                onChange={e => updateEnv('apiKey', e.target.value)}
                            />
                            <p className="text-xs mt-1 text-gray-500">
                                You can get your API keys from your provider.
                            </p>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={() => alert('Quick Test')}
                            >
                                Quick Test
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded"
                                onClick={deleteEnvironment}
                            >
                                Delete
                            </button>
                            <button onClick={saveToServer} className="bg-blue-600 text-white px-4 py-2 rounded">
                                💾 Save Environments
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Right panel with global toggles */}
            {/* <div className="w-full lg:w-80 space-y-4 bg-white p-6 rounded shadow">
                <h3 className="text-lg font-bold mb-2">General</h3>
                {['Streaming', 'Event Logs', 'Responses API'].map(setting => (
                    <label key={setting} className="flex items-center space-x-2">
                        <input type="checkbox" className="h-4 w-4" defaultChecked={setting !== 'Event Logs'} />
                        <span className="font-medium">{setting}</span>
                    </label>
                ))}
            </div> */}
        </div>
    );
};
