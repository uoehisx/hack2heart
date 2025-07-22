import * as vscode from 'vscode';

// 인증 세션 정보를 extension 전체에서 참조할 수 있도록 전역 변수 선언
export let globalSessionInfo: any = null;

import { SidebarProvider } from './sidebarProvider';
import { PanelProvider } from './panelProvider';
import { PANEL_TYPES, SIDEBAR_TYPES } from './constants';
import { axiosRequestServer } from './utils/axiosUtil';
import { setSessionInfo } from './utils/vscodeState';

export function activate(context: vscode.ExtensionContext) {
  // PanelProvider 인스턴스 생성
  const panelProvider = new PanelProvider(context);

  // SidebarProvider 인스턴스 생성 (panelProvider 전달)
  const sidebarProvider = new SidebarProvider(context, panelProvider);

  // PanelProvider에 sidebarProvider 설정
  panelProvider.setSidebarProvider(sidebarProvider);

  // 최초 실행 시 저장된 sessionInfo가 있으면 바로 HOME으로 이동
  // const savedSession = getSessionInfo(context);
  // if (savedSession) {
  //   // webview에도 sessionInfo 전달
  //   sidebarProvider.postMessageToWebview({
  //     type: 'sessionInfo',
  //     session: savedSession,
  //   });
  //   sidebarProvider.changeSidebarContent(SIDEBAR_TYPES.HOME);
  // }

  // Welcome 화면을 여는 명령을 등록합니다.
  context.subscriptions.push(
    vscode.commands.registerCommand('hack2heart.test-command', () => {
      panelProvider.createPanel(PANEL_TYPES.TEST);
    })
  );

  // 인증 명령 등록
  context.subscriptions.push(
    vscode.commands.registerCommand('hack2heart.authenticate', async () => {
      try {
        const session = await vscode.authentication.getSession(
          'github', // 인증 제공자 ID
          ['read:user'], // GitHub OAuth 권한 범위
          { createIfNone: true } // 없으면 로그인 창 표시
        );

        vscode.window.showInformationMessage(
          `Hello, ${session.account.label}!`
        );

        try {
          const res = (
            await axiosRequestServer({
              method: 'POST',
              url: '/auth/github',
              data: {
                access_token: session.accessToken,
              },
            })
          ).data;

          // 인증 성공 시 session 정보를 globalState에 저장
          const sessionInfo = {
            github_oauth_id: session.account.id,
            github_name: session.account.label,
            accessToken: session.accessToken,
            serviceToken: res.access_token,
          };
          // 전역 변수에도 저장
          globalSessionInfo = sessionInfo;
          await setSessionInfo(context, sessionInfo);

          // webview에도 sessionInfo 전달
          sidebarProvider.postMessageToWebview({
            type: 'sessionInfo',
            session: sessionInfo,
          });

          sidebarProvider.changeSidebarContent(SIDEBAR_TYPES.HOME);
        } catch (err: any) {
          if (err?.response?.status === 404) {
            // 인증 성공 시 session 정보를 globalState에 저장
            const sessionInfo = {
              github_oauth_id: session.account.id,
              github_name: session.account.label,
              accessToken: session.accessToken,
            };
            // 전역 변수에도 저장
            globalSessionInfo = sessionInfo;
            await setSessionInfo(context, sessionInfo);

            // webview에도 sessionInfo 전달
            sidebarProvider.postMessageToWebview({
              type: 'sessionInfo',
              session: sessionInfo,
            });

            sidebarProvider.changeSidebarContent(SIDEBAR_TYPES.PROFILE);
          } else {
            vscode.window.showErrorMessage(
              'Failed to send auth info to backend.'
            );
            console.error(err);
          }
        }
      } catch (error) {
        vscode.window.showErrorMessage('Authentication failed.');
        console.error(error);
      }
    })
  );

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
}

// deactivate 함수는 확장이 비활성화될 때 호출됩니다.
export function deactivate() {}
