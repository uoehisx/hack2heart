import * as vscode from 'vscode';
import { SidebarProvider } from './sidebarProvider';
import { PanelProvider } from './panelProvider';

export function activate(context: vscode.ExtensionContext) {
  // SidebarProvider 인스턴스 생성
  const sidebarProvider = new SidebarProvider(context);

  // PanelProvider 인스턴스 생성 (sidebarProvider 전달)
  const panelProvider = new PanelProvider(context, sidebarProvider);

  // Welcome 화면을 여는 명령을 등록합니다.
  let disposable = vscode.commands.registerCommand(
    'hack2heart.test-command',
    () => {
      panelProvider.createPanel(
        'hack2heart.panel-test',
        'Hack2Heart Test Panel'
      );
    }
  );

  context.subscriptions.push(disposable);

  // 사이드바 변경 명령들 등록
  const sidebarCommands = [
    'hack2heart.sidebar-welcome',
    'hack2heart.sidebar-profile',
    'hack2heart.sidebar-home',
    'hack2heart.sidebar-chat',
  ];

  sidebarCommands.forEach(sidebarId => {
    const command = vscode.commands.registerCommand(`${sidebarId}.show`, () => {
      // 먼저 사이드바 컨테이너를 포커스
      vscode.commands.executeCommand(
        'workbench.view.extension.hack2heart-sidebar'
      );
      // 그 다음 특정 사이드바 뷰를 포커스
      setTimeout(() => {
        vscode.commands.executeCommand(`${sidebarId}.focus`);
      }, 100);
    });
    context.subscriptions.push(command);
  });

  // 사이드바 WebviewViewProvider 등록 (단일 사이드바)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'hack2heart.sidebar-welcome',
      sidebarProvider
    )
  );

  // 패널 WebviewViewProvider들 등록
  const panelViews = [
    'hack2heart.panel-test',
    'hack2heart.panel-explore',
    'hack2heart.panel-upload',
    'hack2heart.panel-mycode',
  ];

  panelViews.forEach(viewId => {
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        viewId,
        new SidebarProvider(context)
      )
    );
  });
}

// deactivate 함수는 확장이 비활성화될 때 호출됩니다.
export function deactivate() {}
