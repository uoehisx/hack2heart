// src/webview/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Welcome from './components/welcome/welcome';
// Update the import path to match the actual file location and name

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <Welcome title="Welcome Title" description="This is a description." />
        </React.StrictMode>
    );
} else {
    console.error("Root element not found");
}