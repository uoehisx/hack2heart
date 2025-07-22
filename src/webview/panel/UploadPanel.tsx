import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  AiBlock,
  AskButton,
  CodeBlockWrapper,
  CodeTextarea,
  DescRow,
  Label,
  PreviewWrapper,
  PurpleLabel,
  SelectBox,
  SelectGroup,
  TopBar,
  WhiteButton,
  Wrapper,
} from './UploadPanel.styles';
import { useAuthContext } from '../../contexts/AuthContext';
import { postVsCodeMessage } from '../../utils/vscodeApi';
import { axiosRequest } from '../../hooks/useAxios';
import { User } from '../../constants';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  darcula,
  coy,
  solarizedlight,
  vscDarkPlus,
  okaidia,
  materialLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

const themes = {
  Darcula: darcula,
  Coy: coy,
  SolarizedLight: solarizedlight,
  VscDarkPlus: vscDarkPlus,
  Okaidia: okaidia,
  MaterialLight: materialLight,
};
const fonts = [
  'Fira Code',
  'Source Code Pro',
  'Menlo',
  'Courier New',
  'JetBrains Mono',
  'Consolas',
  'Roboto Mono',
];
const languages = [
  'python',
  'javascript',
  'typescript',
  'cpp',
  'java',
  'go',
  'ruby',
  'php',
  'rust',
];

interface Props {
  code?: string;
  language?: string;
}

export const UploadPanel: React.FC<Props> = ({ code: initialCode = '', language: initialLanguage = 'python' }) => {
  const { session } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Editor state
  const [code, setCode] = useState<string>(initialCode);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [themeName, setThemeName] = useState<keyof typeof themes>('Darcula');
  const [fontFamily, setFontFamily] = useState<string>(fonts[0]);

  // Analysis state
  const [analysis, setAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    postVsCodeMessage({ type: 'requestSessionInfo' });

    const fetchUserProfile = async () => {
      if (session) {
        try {
          const response = await axiosRequest({
            method: 'GET',
            url: '/users/me',
            headers: { Authorization: `Bearer ${session.serviceToken}` },
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };
    fetchUserProfile();
  }, [session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  const handleCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleAnalyze = async () => {
    setLoadingAnalysis(true);
    setAnalysisError(null);
    try {
      const response = await axiosRequest({
        method: 'POST',
        url: '/codes/analyze',
        headers: { Authorization: `Bearer ${session.serviceToken}` },
        data: { content: code },
      });
      setAnalysis(response.data.content);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setAnalysisError('Failed to analyze code.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <Wrapper>
      <TopBar>
        <WhiteButton>Upload</WhiteButton>
      </TopBar>

      <CodeBlockWrapper style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Code input section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Label>Code</Label>
          <CodeTextarea
            placeholder="Paste or write your code here..."
            value={code}
            onChange={handleCodeChange}
          />
          <AskButton onClick={handleAnalyze} disabled={loadingAnalysis} style={{ marginTop: '8px', alignSelf: 'flex-end' }}>
            {loadingAnalysis ? 'Analyzing...' : 'Ask to AI'}
          </AskButton>
        </div>

        {/* Preview section */}
        <PreviewWrapper>
          <Label>Preview</Label>
          <SyntaxHighlighter
            language={language}
            style={themes[themeName]}
            fontFamily={fontFamily}
            customStyle={{
              fontSize: 14,
              borderRadius: 4,
              flex: 1,
              overflow: 'auto',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </PreviewWrapper>
      </CodeBlockWrapper>

      <DescRow>
        <SelectGroup>
          <Label>Language</Label>
          <SelectBox value={language} onChange={e => setLanguage(e.target.value)}>
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </SelectBox>
        </SelectGroup>

        <SelectGroup>
          <Label>Font Family</Label>
          <SelectBox value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
            {fonts.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </SelectBox>
        </SelectGroup>

        <SelectGroup>
          <Label>Theme</Label>
          <SelectBox value={themeName} onChange={e => setThemeName(e.target.value as any)}>
            {Object.keys(themes).map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </SelectBox>
        </SelectGroup>
      </DescRow>

      <PurpleLabel>AI Code Analysis</PurpleLabel>
      <AiBlock>
        {analysisError && <p style={{ color: 'red' }}>{analysisError}</p>}
        {analysis && (
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {analysis}
          </div>
        )}
      </AiBlock>
    </Wrapper>
  );
};
