import path from 'path';
import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._context.extensionPath, 'dist')),
        vscode.Uri.file(path.join(this._context.extensionPath, 'src')),
      ],
    };

    const scriptUri = webviewView.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._context.extensionPath, 'dist', 'bundle.js')
      )
    );
    const styleUri = webviewView.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._context.extensionPath, 'dist', 'main.css')
      )
    );

    // webviewView에서 실제 뷰 ID 가져오기
    const viewId =
      (webviewView as any).viewType || 'hack2heart.sidebar-welcome';
    console.log(`Resolving sidebar view: ${viewId}`);

    const sidebarHtml = getSidebarWebviewContent(
      scriptUri.toString(),
      styleUri.toString(),
      viewId
    );
    webviewView.webview.html = sidebarHtml;

    // 메시지 리스너 추가
    webviewView.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'changeSidebarContent':
          // 사이드바 내용 변경
          const newContent = message.content;
          console.log(`Changing sidebar content to: ${newContent}`);
          this.updateSidebarContent(newContent);
          break;
      }
    });
  }

  private updateSidebarContent(contentType: string) {
    if (this._view) {
      // 새로운 내용 타입을 webview에 전달
      this._view.webview.postMessage({
        command: 'updateContent',
        contentType: contentType,
      });
    }
  }

  // 외부에서 사이드바 내용을 변경할 수 있는 메소드
  public changeSidebarContent(contentType: string) {
    this.updateSidebarContent(contentType);
  }
}

function getSidebarWebviewContent(
  scriptUri: string,
  styleUri: string,
  viewId: string
) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
        <link rel="stylesheet" href="${styleUri}">
    </head>
    <body>
        <div id="root"></div>
        <script>
            // VS Code API를 웹뷰에서 사용할 수 있도록 설정
            const vscode = acquireVsCodeApi();
            window.vscode = vscode;
            
            // 사이드바 정보를 window 객체에 저장
            window.viewInfo = {
              viewType: 'sidebar',
              viewId: '${viewId}'
            };
            
            console.log('Sidebar WebView initialized with:', window.viewInfo);
        </script>
        <script src="${scriptUri}"></script>
    </body>
    </html>`;
}
