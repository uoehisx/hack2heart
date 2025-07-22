import React from 'react';
import {
  AiBlock,
  AskButton,
  CodeBlockWrapper,
  CodeTextarea,
  DescRow,
  Label,
  PurpleLabel,
  SelectBox,
  SelectGroup,
  TopBar,
  WhiteButton,
  Wrapper,
} from './UploadPanel.styles';
import { useAuthContext } from '../../contexts/AuthContext';

export const UploadPanel: React.FC = () => {
  const { session } = useAuthContext();

  console.log('UploadPanel session:', session);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <Wrapper>
      {/* 상단 버튼 */}
      <TopBar>
        <WhiteButton>Upload</WhiteButton>
      </TopBar>

      {/* 코드 입력 */}
      <Label>Code</Label>
      <CodeBlockWrapper>
        <CodeTextarea placeholder="Paste or write your code here..." />
        <AskButton>Ask to AI</AskButton>
      </CodeBlockWrapper>

      {/* 옵션 셀렉터 */}
      <DescRow>
        <SelectGroup>
          <Label>Syntax Highlighting</Label>
          <SelectBox defaultValue="python">
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="cpp">C++</option>
          </SelectBox>
        </SelectGroup>

        <SelectGroup>
          <Label>Font Family</Label>
          <SelectBox defaultValue="fira">
            <option value="fira">Fira Code</option>
            <option value="jetbrains">JetBrains Mono</option>
            <option value="source">Source Code Pro</option>
          </SelectBox>
        </SelectGroup>

        <SelectGroup>
          <Label>Theme</Label>
          <SelectBox defaultValue="vscode">
            <option value="vscode">VSCode</option>
            <option value="monokai">Monokai</option>
            <option value="one-dark">One Dark</option>
          </SelectBox>
        </SelectGroup>
      </DescRow>

      {/* AI 결과 */}
      <PurpleLabel>AI Code Analysis</PurpleLabel>
      <AiBlock>{/* 추후 AI 분석 결과를 이곳에 렌더링 */}</AiBlock>
    </Wrapper>
  );
};
