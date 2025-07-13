export { };

declare global {
    interface Window {
        MyPluginData: {
            apiUrl: string;
            nonce: string;
        };
    }
}


export type AIProviderType =
    | 'OpenAI'
    | 'Anthropic'
    | 'Azure (OpenAI)'
    | 'Google'
    | 'OpenRouter'
    | 'Hugging Face'
    | 'Replicate'
    | 'Perplexity';

export interface EnvironmentConfig {
    id: string;
    name: string;
    type: AIProviderType;
    apiKey: string;
    models?: string[];       // Optional: models specific to this environment
    baseUrl?: string;        // Optional: for custom hosts (e.g., Azure or OpenRouter)
    customHeaders?: Record<string, string>; // Optional for advanced API config
}
