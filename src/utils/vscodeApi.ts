// src/utils/vscodeApi.ts

/**
 * VS Code Webview API 유틸 함수
 * window.vscode가 있으면 메시지 전송, 없으면 콘솔 출력
 */
export function postVsCodeMessage(message: any) {
  if ((window as any).vscode) {
    (window as any).vscode.postMessage(message);
  } else {
    console.log('[VSCode API] Would post message:', message);
  }
}

/**
 * VS Code API에서 현재 활성화된 세션 정보 반환
 */
export function getVsCodeSession() {
  const vscode = (window as any).vscode;
  if (vscode && vscode.getSession) {
    return vscode.getSession();
  }
  return null;
}

/**
 * VS Code API가 활성화되어 있는지 여부 반환
 */
export function isVsCodeApiEnabled(): boolean {
  return !!(window as any).vscode;
}

/**
 * VS Code API에서 메시지 수신 핸들러 등록
 */
export function onVsCodeMessage(handler: (event: MessageEvent) => void) {
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}
