// src/webview/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';

import './global.css';
import { WelcomeSidebar } from './sidebar/Welcome';
import { WelcomePanel } from './panel/Welcome';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <WelcomeSidebar />
      {/* <WelcomePanel /> */}
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
