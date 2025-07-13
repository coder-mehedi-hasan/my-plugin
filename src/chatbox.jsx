import { createRoot } from 'react-dom/client';
import './index.css';

const Chatbox = () => {
    return (
        <div className="bg-white p-4 rounded shadow-lg border w-full">
            <h4 className="font-bold mb-2">AI Chat</h4>
            <div className="h-40 overflow-y-auto border p-2 text-sm">Chat coming soon...</div>
            <input
                className="w-full mt-2 p-1 border rounded"
                placeholder="Type a message..."
            />
        </div>
    );
};

const container = document.getElementById('my-plugin-chatbox-root');
if (container) {
    const root = createRoot(container);
    root.render(<Chatbox />);
}
