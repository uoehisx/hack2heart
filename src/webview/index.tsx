// src/webview/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';

import './global.css';
import { WelcomeSidebar } from './sidebar/Welcome';
import { WelcomePanel } from './panel/Welcome';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  // sidebar인지 panel인지 판별 (window.location.hash 또는 window.acquireVsCodeApi() 등 활용 가능)
  // 여기서는 간단히 window.location.search에 ?view=sidebar 또는 ?view=panel이 붙는다고 가정
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  root.render(
    <React.StrictMode>
      {view === 'sidebar' ? <WelcomeSidebar /> : <WelcomePanel />}
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
