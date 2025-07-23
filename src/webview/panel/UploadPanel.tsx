// UploadPanel.tsx
import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
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

import { Loading } from '../components/loading';
import { renderToStaticMarkup } from 'react-dom/server';
import { Toast } from '../components/toast';

import '../../webview/global.css';

const themes = {
  Darcula: darcula,
  Coy: coy,
  SolarizedLight: solarizedlight,
  VscDarkPlus: vscDarkPlus,
  Okaidia: okaidia,
  MaterialLight: materialLight,
} as const;

const withFont = (base: any, ff: string) => ({
  ...base,
  'pre[class*="language-"]': {
    ...(base['pre[class*="language-"]'] || {}),
    fontFamily: `'${ff}', monospace`,
  },
  'code[class*="language-"]': {
    ...(base['code[class*="language-"]'] || {}),
    fontFamily: `'${ff}', monospace`,
  },
});

const fonts = [
  'Fira Code',
  'Source Code Pro',
  'JetBrains Mono',
  'Consolas',
  'Roboto Mono',
] as const;

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
] as const;

interface Props {
  code?: string;
  language?: string;
}

export const UploadPanel: React.FC<Props> = ({
  code: initialCode = '',
  language: initialLanguage = 'python',
}) => {
  const { session } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // editor
  const [code, setCode] = useState(initialCode);
  const [codeLang, setCodeLang] = useState(initialLanguage);
  const [themeName, setThemeName] = useState<keyof typeof themes>('Darcula');
  const [fontFamily, setFontFamily] = useState<(typeof fonts)[number]>(
    fonts[0]
  );

  // analysis
  const [analysis, setAnalysis] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // preview ref
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    postVsCodeMessage({ type: 'requestSessionInfo' });

    const fetchUserProfile = async () => {
      if (!session) return;
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
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!uploadSuccess) return;
    const t = setTimeout(() => setUploadSuccess(false), 2500);
    return () => clearTimeout(t);
  }, [uploadSuccess]);

  if (!session) return <Loading />;

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

  const handleUpload = async () => {
    if (!session) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      let htmlString = '';

      if (previewRef.current) {
        htmlString = `<div style="font-family:'${fontFamily}', monospace;">${previewRef.current.innerHTML}</div>`;
      } else {
        htmlString = renderToStaticMarkup(
          <SyntaxHighlighter
            language={codeLang}
            style={themes[themeName]}
            wrapLongLines
            customStyle={{
              fontFamily: `'${fontFamily}', monospace`,
              fontSize: 14,
              borderRadius: 4,
              overflow: 'auto',
              margin: 0,
            }}
            codeTagProps={{
              style: { fontFamily: `'${fontFamily}', monospace` },
            }}
            key={`${themeName}-${codeLang}-${fontFamily}`}
          >
            {code}
          </SyntaxHighlighter>
        );
      }

      const res = await axiosRequest({
        method: 'POST',
        url: 'users/me/codes',
        headers: { Authorization: `Bearer ${session.serviceToken}` },
        data: { content: htmlString },
      });

      if (res.status === 201) {
        setUploadSuccess(true);
        setCode('');
        setAnalysis('');
        setCodeLang('python');
        setThemeName('Darcula');
        setFontFamily(fonts[0]);
      }
    } catch (err: any) {
      console.error(err);
      setUploadError('Failed to upload code.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {uploadSuccess && <Toast>Upload Success</Toast>}
      <Wrapper>
        <TopBar>
          <WhiteButton onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </WhiteButton>
        </TopBar>

        <CodeBlockWrapper
          style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
        >
          {/* Code input */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Label>Code</Label>
            <CodeTextarea
              placeholder="Paste or write your code here..."
              value={code}
              onChange={handleCodeChange}
            />
            <AskButton
              onClick={handleAnalyze}
              disabled={loadingAnalysis}
              style={{ marginTop: 8, alignSelf: 'flex-end' }}
            >
              {loadingAnalysis ? 'Analyzing...' : 'Ask to AI'}
            </AskButton>
          </div>

          {/* Preview */}
          <PreviewWrapper>
            <Label>Preview</Label>
            <div
              ref={previewRef}
              style={{ fontFamily: `'${fontFamily}', monospace` }}
            >
              <SyntaxHighlighter
                key={`${themeName}-${codeLang}-${fontFamily}`}
                language={codeLang}
                style={withFont(themes[themeName], fontFamily)}
                wrapLongLines
                customStyle={{
                  fontFamily: `'${fontFamily}'`,
                  fontSize: 14,
                  borderRadius: 4,
                  flex: 1,
                  overflow: 'auto',
                  margin: 0,
                }}
                codeTagProps={{
                  style: { fontFamily: `'${fontFamily}'` },
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </PreviewWrapper>
        </CodeBlockWrapper>

        <DescRow>
          <SelectGroup>
            <Label>Language</Label>
            <SelectBox
              value={codeLang}
              onChange={e => setCodeLang(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </SelectBox>
          </SelectGroup>

          <SelectGroup>
            <Label>Font Family</Label>
            <SelectBox
              value={fontFamily}
              onChange={e => {
                console.log('Font changed to:', e.target.value);
                setFontFamily(e.target.value as any);
              }}
            >
              {fonts.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </SelectBox>
          </SelectGroup>

          <SelectGroup>
            <Label>Theme</Label>
            <SelectBox
              value={themeName}
              onChange={e =>
                setThemeName(e.target.value as keyof typeof themes)
              }
            >
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
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
              }}
            >
              {analysis}
            </div>
          )}
        </AiBlock>
      </Wrapper>
    </>
  );
};
