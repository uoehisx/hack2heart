import React, { useState, useEffect } from 'react';
import { WelcomeSidebar } from './WelcomeSidebar';
import { ProfileSidebar } from './ProfileSidebar';
import { HomeSidebar } from './HomeSidebar';
import { TestSidebar } from './TestSidebar';
import { SIDEBAR_TYPES } from '../../constants';
import ChatSidebar from './ChatSidebar';

interface VscodeApi {
  postMessage(message: any): void;
}

declare const vscode: VscodeApi;

export const Sidebar = ({
  viewId,
}: {
  viewId?: SIDEBAR_TYPES; // Optional prop to pass viewId if needed
}) => {
  const [currentViewId, setCurrentViewId] = useState<SIDEBAR_TYPES>(
    viewId || SIDEBAR_TYPES.WELCOME
  );
  const [currentOption, setCurrentOption] = useState<any>(null);

  useEffect(() => {
    // VS Code에서 메시지를 받는 리스너
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'updateContent') {
        console.log('Received updateContent message:', message.viewId);
        setCurrentViewId(message.viewId as SIDEBAR_TYPES);
        setCurrentOption(message.option || {});
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {(() => {
        switch (currentViewId) {
          case SIDEBAR_TYPES.WELCOME:
            return <WelcomeSidebar />;
          case SIDEBAR_TYPES.PROFILE:
            return <ProfileSidebar />;
          case SIDEBAR_TYPES.HOME:
            return <HomeSidebar />;
          case SIDEBAR_TYPES.CHAT:
            if (!currentOption.chatroomId) {
              return <HomeSidebar />;
            }
            return <ChatSidebar chatroomId={currentOption.chatroomId} />;
          default:
            return <TestSidebar />;
        }
      })()}
    </div>
  );
};
