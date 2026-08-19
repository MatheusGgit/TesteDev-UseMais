import { createRoot } from 'react-dom/client';
import { App } from './pages/app';

const container = document.getElementById('app');

if (container) {
    createRoot(container).render(<App />);
}
