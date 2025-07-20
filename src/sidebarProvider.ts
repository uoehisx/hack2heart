import path from 'path';
import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
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

    const sidebarHtml = getSidebarWebviewContent(
      scriptUri.toString(),
      styleUri.toString(),
      'hack2heart.sidebar-welcome' // sidebar의 경우 기본 ID 사용
    );
    webviewView.webview.html = sidebarHtml;
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
