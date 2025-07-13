import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatbotsTab } from '../components/admin/ChatbotsTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { TabHeader } from '../components/admin/TabHeader';
import '../index.css';

const AdminApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Chatbots');

    return (
        <div className="p-6 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">AI Plugin Settings</h1>
            <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'Chatbots' && <ChatbotsTab />}
            {activeTab === 'Settings' && <SettingsTab />}
        </div>
    );
};

const container = document.getElementById('my-plugin-admin-root');
if (container) {
    const root = createRoot(container);
    root.render(<AdminApp />);
}
