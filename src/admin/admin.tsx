import { createRoot } from 'react-dom/client';
import '../index.css';

const AdminApp = () => {
    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">React AI Chatbot</h2>
            {/* Mimic layout from uploaded image */}
            <div className="bg-white p-4 rounded shadow">
                <p className="font-semibold">Environment Settings</p>
                {/* Form inputs go here */}
            </div>
        </div>
    );
};

const container = document.getElementById('my-plugin-admin-root');
if (container) {
    const root = createRoot(container);
    root.render(<AdminApp />);
}
