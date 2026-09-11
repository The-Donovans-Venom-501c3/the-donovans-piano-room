import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider as JotaiProvider } from 'jotai'


const root = document.getElementById('root');

if (root) {
    ReactDOM.createRoot(root).render(
    <JotaiProvider>
            <App />
    </JotaiProvider>
    );
}
