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

const CREATE_ENDPOINT = '/create_user_code'; // adjust if different

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
  const [fontFamily, setFontFamily] = useState(fonts[0]);

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

  if (!session) {
    return <Loading />;
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

  const handleUpload = async () => {
    if (!session) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      let htmlString = '';

      // Prefer grabbing exactly what the user sees
      if (previewRef.current) {
        // include wrapper to ensure font style is preserved
        htmlString = `<div style="font-family:${fontFamily};">${previewRef.current.innerHTML}</div>`;
      } else {
        // Fallback to static render (won’t include runtime CSS classes)
        htmlString = renderToStaticMarkup(
          <SyntaxHighlighter
            language={codeLang}
            style={themes[themeName]}
            customStyle={{
              fontFamily,
              fontSize: 14,
              borderRadius: 4,
              overflow: 'auto',
            }}
          >
            {code}
          </SyntaxHighlighter>
        );
      }

      const res = await axiosRequest({
        method: 'POST',
        url: CREATE_ENDPOINT,
        headers: { Authorization: `Bearer ${session.serviceToken}` },
        data: { content: htmlString },
      });

      if (res.status === 201) setUploadSuccess(true);
    } catch (err: any) {
      console.error(err);
      setUploadError('Failed to upload code.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Wrapper>
      <TopBar>
        <WhiteButton onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </WhiteButton>
      </TopBar>

      <CodeBlockWrapper
        style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
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
            style={{ marginTop: '8px', alignSelf: 'flex-end' }}
          >
            {loadingAnalysis ? 'Analyzing...' : 'Ask to AI'}
          </AskButton>
        </div>

        {/* Preview */}
        <PreviewWrapper>
          <Label>Preview</Label>
          <div ref={previewRef}>
            <SyntaxHighlighter
              language={codeLang}
              style={themes[themeName]}
              customStyle={{
                fontFamily,
                fontSize: 14,
                borderRadius: 4,
                flex: 1,
                overflow: 'auto',
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
            onChange={e => setFontFamily(e.target.value)}
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
            onChange={e => setThemeName(e.target.value as any)}
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

      {uploadError && (
        <p style={{ color: 'red', marginTop: 12 }}>{uploadError}</p>
      )}
      {uploadSuccess && (
        <p style={{ color: '#6cf', marginTop: 12 }}>Upload success!</p>
      )}
    </Wrapper>
  );
};
