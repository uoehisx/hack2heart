import * as vscode from 'vscode';
import * as path from 'path';

export class PanelProvider {
  constructor(private readonly _context: vscode.ExtensionContext) {}

  public createPanel(panelId: string, title: string): void {
    const panel = vscode.window.createWebviewPanel(
      panelId, // Webview 패널의 고유 ID
      title, // 사용자에게 표시될 패널 제목
      vscode.ViewColumn.One, // 새 패널을 표시할 열
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._context.extensionPath, 'dist')),
          vscode.Uri.file(path.join(this._context.extensionPath, 'src')),
        ],
      }
    );

    // 'dist' 폴더 내의 번들된 JavaScript 파일 경로를 가져옵니다.
    const scriptUri = panel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._context.extensionPath, 'dist', 'bundle.js')
      )
    );

    // CSS 파일 경로를 가져옵니다.
    const styleUri = panel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._context.extensionPath, 'dist', 'main.css')
      )
    );

    // Webview에 대한 HTML 콘텐츠를 설정합니다.
    // panel에서는 쿼리스트링으로 view=panel&id={panelId} 전달
    panel.webview.html = this.getPanelWebviewContent(
      scriptUri.toString(),
      styleUri.toString(),
      panelId
    );

    console.log(`Panel created successfully: ${panelId}`);

    // 패널이 닫힐 때의 이벤트 핸들러
    panel.onDidDispose(() => {
      console.log('Welcome panel disposed');
    });

    // 웹뷰에서 메시지를 받을 때의 이벤트 핸들러
    panel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'alert':
          vscode.window.showInformationMessage(message.text);
          return;
        case 'log':
          console.log(message.text);
          return;
        case 'openPanel':
          // 새로운 패널 열기
          const newPanelId = message.panelId;
          const newTitle = message.title;
          console.log(`Opening new panel: ${newPanelId} - ${newTitle}`);
          this.createPanel(newPanelId, newTitle);
          return;
      }
    });
  }

  private getPanelWebviewContent(
    scriptUri: string,
    styleUri: string,
    panelId: string
  ): string {
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
            
            // 패널 정보를 window 객체에 저장
            window.viewInfo = {
              viewType: 'panel',
              viewId: '${panelId}'
            };
            
            console.log('Panel WebView initialized with:', window.viewInfo);
        </script>
        <script src="${scriptUri}"></script>
    </body>
    </html>`;
  }
}
