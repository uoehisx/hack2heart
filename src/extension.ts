import * as vscode from 'vscode';
import { SidebarProvider } from './sidebarProvider';
import { PanelProvider } from './panelProvider';
import { PANEL_TYPES, SIDEBAR_TYPES } from './constants';

export function activate(context: vscode.ExtensionContext) {
  // PanelProvider 인스턴스 생성
  const panelProvider = new PanelProvider(context);

  // SidebarProvider 인스턴스 생성 (panelProvider 전달)
  const sidebarProvider = new SidebarProvider(context, panelProvider);

  // PanelProvider에 sidebarProvider 설정
  panelProvider.setSidebarProvider(sidebarProvider);

  // Welcome 화면을 여는 명령을 등록합니다.
  let disposable = vscode.commands.registerCommand(
    'hack2heart.test-command',
    () => {
      panelProvider.createPanel(PANEL_TYPES.TEST);
    }
  );

  context.subscriptions.push(disposable);

  // 사이드바 변경 명령들 등록
  Object.values(SIDEBAR_TYPES).forEach(viewId => {
    const command = vscode.commands.registerCommand(`${viewId}.show`, () => {
      // 먼저 사이드바 컨테이너를 포커스
      vscode.commands.executeCommand(
        'workbench.view.extension.hack2heart-sidebar'
      );
      // 그 다음 특정 사이드바 뷰를 포커스
      setTimeout(() => {
        vscode.commands.executeCommand(`${viewId}.focus`);
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
  Object.values(PANEL_TYPES).forEach(viewId => {
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        viewId,
        new SidebarProvider(context, panelProvider)
      )
    );
  });
}

// deactivate 함수는 확장이 비활성화될 때 호출됩니다.
export function deactivate() {}
