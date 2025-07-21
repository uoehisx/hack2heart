// src/webview/panel/UploadPanel.tsx
import React from 'react';
import styled from 'styled-components';

/* ───────── 기본 레이아웃 ───────── */
const Wrapper = styled.div`
  min-height: 100vh;
  padding: 48px 0;
  background: #1a1a1a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ───────── 상단 버튼 영역 ───────── */
const TopBar = styled.div`
  width: 830px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 24px;
`;

const BlackButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4),
              -6px -6px 12px #1f1f1f;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: inset 6px 6px 12px rgba(0, 0, 0, 0.4),
                inset -6px -6px 12px #1f1f1f;
  }
`;
const WhiteButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background: #FFFFFF;
  color: #000000;
  font-size: 14px;
  cursor: pointer;
  transition: box-shadow 0.15s;
   box-shadow: 6px 6px 12px #000000,
              -2px -2px 12px #000000;

  &:hover {
    box-shadow: inset 6px 6px 12px #ffffff,
                inset -6px -6px 12px #ffffff;
  }
`;

/* ───────── 레이블 ───────── */
const Label = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 10px;
  align-self:flex-start;
  color:#ffffff;
`;
const PurpleLabel=styled(Label)`
  color:#A37EF2
  `;

/* ───────── 코드 입력 영역 ───────── */
const CodeBlockWrapper = styled.div`
  position: relative;
  width: 830px;
  height: 300px;
  margin-bottom: 32px;
  background: #1a1a1a;
  border-radius: 20px;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4),
              -6px -6px 12px #1f1f1f;
`;

const CodeTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  padding: 24px;
  font-size: 14px;
  font-family: 'Fira Code', monospace;
  line-height: 1.4;
`;

/* ‑‑ 코드 블록 내부의 "Ask to AI" 버튼 ‑‑ */
const AskButton = styled.button`
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 4px 12px;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  transition: box-shadow 0.15s;
  box-shadow: 6px 6px 12px #000000,
              -2px -2px 12px #000000;

  &:hover {
    box-shadow: inset 6px 6px 12px #ffffff,
                inset -6px -6px 12px #ffffff;
  }
`;

/* ───────── 옵션 셀렉터 영역 ───────── */
const DescRow = styled.div`
  width: 830px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 48px;
`;

const SelectGroup = styled.div`
  flex: 1 1 240px;
  min-width: 240px;
`;

const SelectBox = styled.select`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border: none;
  border-radius: 20px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4),
              -6px -6px 12px #1f1f1f;
  appearance: none;          /* 기본 화살표 제거 */
  background-image: url("data:image/svg+xml,%3Csvg fill='%23fff' height='8' viewBox='0 0 24 24' width='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); 
  background-repeat: no-repeat;
  background-position: calc(100% - 16px) center;
`;

/* ───────── AI 분석 결과 영역 ───────── */
const AiBlock = styled.div`
  width: 830px;
  height: 300px;
  background: #1a1a1a;
  border-radius: 20px;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4),
              -6px -6px 12px #1f1f1f;
  padding: 24px;
  font-size: 14px;
  overflow-y: auto;
`;

/* ───────── 컴포넌트 ───────── */
export const UploadPanel: React.FC = () => {
  return (
    <Wrapper>
      {/* 상단 버튼 */}
      <TopBar>
        <BlackButton>Back</BlackButton>
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
      <AiBlock>
        {/* 추후 AI 분석 결과를 이곳에 렌더링 */}
      </AiBlock>
    </Wrapper>
  );
};
