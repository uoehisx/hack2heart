// src/webview/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import { TestPanel } from './panel/TestPanel';
import { UploadPanel } from './panel/UploadPanel';
import { ExplorePanel } from './panel/ExplorePanel';
import { MycodePanel } from './panel/MycodePanel';
import { Sidebar } from './sidebar/Sidebar';

// Webview ID와 타입을 추출하는 함수
function getViewInfo(): { viewType: 'sidebar' | 'panel'; viewId: string } {
  console.log('=== DEBUG INFO ===');

  // VS Code API에서 window.viewInfo 확인 (provider에서 설정됨)
  if ((window as any).viewInfo) {
    const viewInfo = (window as any).viewInfo;
    console.log('Got viewInfo from window:', viewInfo);
    return {
      viewType: viewInfo.viewType,
      viewId: viewInfo.viewId,
    };
  }

  // 기본값
  const result = {
    viewType: 'panel' as const,
    viewId: 'hack2heart.panel-test',
  };
  return result;
}

// 컴포넌트 렌더링 함수
function renderComponent(viewType: 'sidebar' | 'panel', viewId: string) {
  console.log(`=== RENDERING COMPONENT ===`);
  console.log(`ViewType: "${viewType}", ViewId: "${viewId}"`);

  if (viewType === 'panel') {
    switch (viewId) {
      case 'hack2heart.panel-test':
        return <TestPanel />;
      case 'hack2heart.panel-explore':
        return <ExplorePanel />;
      case 'hack2heart.panel-upload':
        return <UploadPanel />;
      case 'hack2heart.panel-mycode':
        return <MycodePanel />;
      default:
        return <TestPanel />;
    }
  } else {
    return <Sidebar viewId={viewId} />;
  }
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  const { viewType, viewId } = getViewInfo();

  console.log(`Rendering ${viewType} component with ID: ${viewId}`);

  root.render(
    <React.StrictMode>{renderComponent(viewType, viewId)}</React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
