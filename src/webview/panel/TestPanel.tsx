import React from 'react';

export const TestPanel = () => {
  const openPanel = (panelId: string, title: string) => {
  // VS Code API를 통해 메시지 전송
  if ((window as any).vscode) {
    (window as any).vscode.postMessage({
      command: 'openPanel',
      panelId: panelId,
      title: title,
    });
  } else {
    console.log(`Would open panel: ${panelId} - ${title}`);
  }
};

  const openSidebar = (sidebarId: string, title: string) => {
    // VS Code API를 통해 사이드바 변경 메시지 전송
    if ((window as any).vscode) {
      (window as any).vscode.postMessage({
        command: 'changeSidebar',
        sidebarId: sidebarId,
        title: title,
      });
    } else {
      console.log(`Would change to sidebar: ${sidebarId} - ${title}`);
    }
  };

  const panelButtons = [
    { id: 'hack2heart.panel-explore', title: 'Explore Panel', icon: '🔍' },
    { id: 'hack2heart.panel-upload', title: 'Upload Panel', icon: '📤' },
    { id: 'hack2heart.panel-mycode', title: 'My Code Panel', icon: '💻' },
  ];

  const sidebarButtons = [
    {
      id: 'hack2heart.sidebar-welcome',
      title: 'Welcome Sidebar',
      icon: '🏠',
    },
    {
      id: 'hack2heart.sidebar-profile',
      title: 'Profile Sidebar',
      icon: '👤',
    },
    { id: 'hack2heart.sidebar-home', title: 'Home Sidebar', icon: '🏡' },
    { id: 'hack2heart.sidebar-chat', title: 'Chat Sidebar', icon: '💬' },
  ];

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'var(--vscode-font-family)',
        color: 'var(--vscode-foreground)',
        backgroundColor: 'var(--vscode-editor-background)',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: 'var(--vscode-titleBar-activeForeground)',
        }}
      >
        🧪 테스트 패널
      </h1>

      <div
        style={{
          background: 'var(--vscode-inputValidation-infoBackground)',
          border: '1px solid var(--vscode-inputValidation-infoBorder)',
          padding: '16px',
          borderRadius: '6px',
          marginBottom: '24px',
          color: 'var(--vscode-inputValidation-infoForeground)',
        }}
      >
        <p style={{ margin: '0', lineHeight: '1.5' }}>
          이 패널에서 다른 패널들과 사이드바 내용을 테스트할 수 있습니다. 아래
          버튼들을 클릭해서 각각의 뷰를 열거나 사이드바 내용을 변경해보세요.
        </p>
      </div>

      {/* 패널 버튼들 */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--vscode-titleBar-activeForeground)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📋 패널 테스트
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {panelButtons.map(panel => (
            <button
              key={panel.id}
              onClick={() => openPanel(panel.id, panel.title)}
              style={{
                background: 'var(--vscode-button-background)',
                color: 'var(--vscode-button-foreground)',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background =
                  'var(--vscode-button-hoverBackground)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background =
                  'var(--vscode-button-background)';
              }}
            >
              <span style={{ fontSize: '16px' }}>{panel.icon}</span>
              {panel.title}
            </button>
          ))}
        </div>
      </div>

      {/* 사이드바 버튼들 */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--vscode-titleBar-activeForeground)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📱 사이드바 내용 변경 테스트
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {sidebarButtons.map(sidebar => (
            <button
              key={sidebar.id}
              onClick={() => openSidebar(sidebar.id, sidebar.title)}
              style={{
                background: 'var(--vscode-secondaryButton-background)',
                color: 'var(--vscode-secondaryButton-foreground)',
                border: '1px solid var(--vscode-button-border)',
                padding: '12px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background =
                  'var(--vscode-secondaryButton-hoverBackground)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background =
                  'var(--vscode-secondaryButton-background)';
              }}
            >
              <span style={{ fontSize: '16px' }}>{sidebar.icon}</span>
              {sidebar.title}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: 'var(--vscode-sideBar-background)',
          padding: '16px',
          borderRadius: '6px',
          border: '1px solid var(--vscode-sideBar-border)',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            color: 'var(--vscode-sideBarTitle-foreground)',
            fontSize: '16px',
          }}
        >
          📊 현재 환경 정보
        </h3>
        <ul
          style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '14px',
            lineHeight: '1.6',
            opacity: '0.9',
          }}
        >
          <li>
            현재 패널 ID: <code>hack2heart.panel-test</code>
          </li>
          <li>
            패널 타입: <strong>Panel</strong>
          </li>
          <li>
            VS Code API 사용:{' '}
            {(window as any).vscode ? '✅ 활성화' : '❌ 비활성화'}
          </li>
          <li>
            등록된 패널 수: <strong>{panelButtons.length}개</strong>
          </li>
          <li>
            등록된 사이드바 수: <strong>{sidebarButtons.length}개</strong>
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '12px',
          background: 'var(--vscode-inputValidation-warningBackground)',
          border: '1px solid var(--vscode-inputValidation-warningBorder)',
          borderRadius: '4px',
          color: 'var(--vscode-inputValidation-warningForeground)',
          fontSize: '12px',
        }}
      >
        💡 <strong>개발 팁:</strong> 개발자 도구 콘솔을 열어서 각 패널과
        사이드바가 올바르게 분기되는지 확인해보세요! 패널 버튼은 새 패널을 열고,
        사이드바 버튼은 사이드바의 내용을 다른 컴포넌트로 변경합니다.
      </div>
    </div>
  );
};
