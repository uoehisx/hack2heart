import * as vscode from 'vscode';
import * as path from 'path'; // path 모듈 임포트

export function activate(context: vscode.ExtensionContext) {
    console.log('축하합니다! 확장 프로그램 "hack2heart"가 활성화되었습니다!');

    // Welcome 화면을 여는 명령을 등록합니다.
    let disposable = vscode.commands.registerCommand('hack2heart.showWelcome', () => {
        const panel = vscode.window.createWebviewPanel(
            'welcomeScreen', // Webview 패널의 고유 ID
            'Hack2Heart에 오신 것을 환영합니다!', // 사용자에게 표시될 패널 제목
            vscode.ViewColumn.One, // 새 패널을 표시할 열
            {
                enableScripts: true, // Webview에서 스크립트 실행 허용
                // 로컬 리소스 루트 지정: 'dist' 폴더에서 리소스를 로드할 수 있도록 허용
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))]
            }
        );

        // 'dist' 폴더 내의 번들된 JavaScript 파일 경로를 가져옵니다.
        const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'bundle.js'));
        const scriptUri = panel.webview.asWebviewUri(onDiskPath);

        // CSS 파일 경로를 가져옵니다. (webpack 설정에 따라 경로가 다를 수 있습니다.)
        const styleUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'dist', 'main.css')));

        // Webview에 대한 HTML 콘텐츠를 설정합니다.
        panel.webview.html = getWebviewContent(scriptUri.toString(), styleUri.toString());
    });

    context.subscriptions.push(disposable);

    // (선택 사항) 확장 프로그램 활성화 시 Welcome 화면을 자동으로 한 번만 표시합니다.
    // 이 기능을 사용하려면, globalState에 플래그를 저장하여 한 번만 표시되도록 제어하는 메커니즘을 구현하는 것이 좋습니다.
    // vscode.commands.executeCommand('hack2heart.showWelcome');
}

// Webview에 표시될 HTML 콘텐츠를 반환하는 헬퍼 함수
function getWebviewContent(scriptUri: string, styleUri: string) {
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
            // 이 코드는 'bundle.js'에 포함된 React 앱 엔트리 포인트와 일치해야 합니다.
            // 예를 들어, src/components/Welcome/Welcome.tsx 파일이 React 앱의 루트 컴포넌트이고,
            // 이 컴포넌트가 'root' div에 렌더링되도록 번들되어 있다고 가정합니다.
            // 실제 React 렌더링 코드는 webpack을 통해 bundle.js에 포함될 것입니다.
        </script>
    </body>
    </html>`;
}

// deactivate 함수는 확장이 비활성화될 때 호출됩니다.
export function deactivate() {}