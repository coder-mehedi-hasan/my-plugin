export default {
    chatbots: {
        base: "chatbots",
        byId: (id: string | number) => `chatbots/${id}`,
    },
    environments: {
        base: "environments",
        byId: (id: string | number) => `environments/${id}`
    }
} 