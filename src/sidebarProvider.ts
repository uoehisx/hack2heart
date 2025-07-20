import path from 'path';
import * as vscode from 'vscode';

export class WelcomeSidebarProvider implements vscode.WebviewViewProvider {
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

    // sidebar에서는 쿼리스트링으로 view=sidebar 전달
    const sidebarHtml = getSidebarWebviewContent(
      scriptUri.toString(),
      styleUri.toString()
    );
    webviewView.webview.html = sidebarHtml;
  }
}

function getSidebarWebviewContent(scriptUri: string, styleUri: string) {
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
        <script src="${scriptUri}"></script>
        <script>
            // Webview 내에서 React 앱을 초기화하는 코드
        </script>
    </body>
    </html>`;
}
