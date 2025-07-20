import React, { useState, useEffect } from 'react';
import { WelcomeSidebar } from './WelcomeSidebar';
import { ProfileSidebar } from './ProfileSidebar';
import { HomeSidebar } from './HomeSidebar';
import { ChatSidebar } from './ChatSidebar';

interface VscodeApi {
  postMessage(message: any): void;
}

declare const vscode: VscodeApi;

export const Sidebar = ({
  viewId,
}: {
  viewId?: string; // Optional prop to pass viewId if needed
}) => {
  const [currentContent, setCurrentContent] = useState<string>(
    viewId || 'welcome'
  );

  useEffect(() => {
    // VS Code에서 메시지를 받는 리스너
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'updateContent') {
        console.log('Received updateContent message:', message.contentType);
        setCurrentContent(message.contentType);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  // Handler to move to profile sidebar
  const handleGoToProfile = () => setCurrentContent('profile');

  const renderCurrentSidebar = () => {
    switch (currentContent) {
      case 'test':
        return <WelcomeSidebar onGithubLogin={handleGoToProfile} />;
      case 'profile':
        return <ProfileSidebar />;
      case 'home':
        return <HomeSidebar />;
      case 'chat':
        return <ChatSidebar />;
      default:
        return <WelcomeSidebar onGithubLogin={handleGoToProfile} />;
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {renderCurrentSidebar()}
    </div>
  );
};
