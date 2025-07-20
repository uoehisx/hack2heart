import * as vscode from 'vscode';
import * as path from 'path';
import { SidebarProvider } from './sidebarProvider';
import { PanelProvider } from './panelProvider';

export function activate(context: vscode.ExtensionContext) {
  // PanelProvider 인스턴스 생성
  const panelProvider = new PanelProvider(context);

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

  // 사이드바 WebviewViewProvider 등록
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'hack2heart.sidebar-welcome',
      new SidebarProvider(context)
    )
  );

  // 패널 WebviewViewProvider들 등록 (필요한 경우)
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
