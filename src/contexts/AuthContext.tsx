import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export interface AuthSession {
  // GitHub 인증 정보
  github_oauth_id?: string;
  github_name?: string;
  github_email?: string;
  accessToken?: string;

  // 서비스 자체 세션 정보
  serviceToken?: string;
}

interface AuthContextType {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    // VS Code Webview에서 sessionInfo 메시지 수신
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'sessionInfo') {
        setSession(event.data.session);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
