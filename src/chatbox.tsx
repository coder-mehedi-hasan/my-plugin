import { createRoot } from 'react-dom/client';
import Chatbox from './components/common/Chatbox';
import './index.css';

const rootEl = document.getElementById('my-plugin-chatbox-root');
const botId = rootEl?.getAttribute('data-bot-id') || 'default';
if (rootEl) {
    const root = createRoot(rootEl);
    root.render(<Chatbox botId={botId} />);
}
