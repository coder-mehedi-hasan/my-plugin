
export const TabHeader = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => (
    <div className="flex space-x-4 border-b pb-2 mb-4">
        {['Chatbots', 'Settings'].map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-semibold ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
                    }`}
            >
                {tab}
            </button>
        ))}
    </div>
);
