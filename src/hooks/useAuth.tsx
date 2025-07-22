import { useEffect, useState } from 'react';

interface AuthSession {
  accessToken?: string;
  user?: {
    id: string;
    name: string;
    email?: string;
  };
  [key: string]: any;
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // VS Code API는 window.acquireVsCodeApi()를 통해 webview에서 사용 가능
    try {
      const vscode = (window as any).acquireVsCodeApi?.();
      if (vscode) {
        console.log('================================');
        console.dir(vscode);
        console.log('================================');

        // // 세션 요청 메시지 전송
        // vscode.postMessage({ type: 'getSession' });
        // // 응답 처리
        // const handler = (event: MessageEvent) => {
        //   if (event.data?.type === 'sessionInfo') {
        //     setSession(event.data.session);
        //     setLoading(false);
        //   }
        // };
        // window.addEventListener('message', handler);
        // return () => window.removeEventListener('message', handler);
      } else {
        setError('VS Code API not available');
        setLoading(false);
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);

  return { session, loading, error };
}
