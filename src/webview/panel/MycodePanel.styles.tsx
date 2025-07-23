import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 32px 24px;
  background: #1b1b1b; /* deep dark */
  font-family: 'Inter', sans-serif;
  color: #ffffff;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
`;

export const PlusButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 36px;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const neumorphismDark = css`
  background: #1b1b1b;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.9), -6px -6px 12px #1a1a1a;
  border-radius: 16px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9), -4px -4px 8px #1a1a1a;
  }
`;

export const BlanksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 5개까지 한 줄에 균등 분할
  gap: 20px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 1200px; // 더 넓게
  margin-left: auto;
  margin-right: auto;
  min-height: 180px;
  justify-items: center; // 각 칸 내용 중앙 정렬
`;

export const BlankWrapper = styled.div<{ isOver: boolean }>`
  width: 95%; // grid 셀을 거의 다 채우게
  height: 170px;
  ${neumorphismDark};
  ${p =>
    p.isOver &&
    css`
      box-shadow: inset 4px 4px 12px rgba(0, 0, 0, 0.9),
        inset -4px -4px 12px #1a1a1a;
    `};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: box-shadow 0.2s;
`;

export const CloseBtn = styled.button<{ big?: boolean }>`
  position: absolute;
  top: 4px;
  right: 4px;
  border: none;
  background: transparent;
  font-size: ${p => (p.big ? '28px' : '16px')};
  color: #595959;
  cursor: pointer;
  font-weight: bold;
  line-height: 1;
  padding: 0 4px;
  z-index: 2;
  transition: color 0.15s;
  &:hover {
    color: #595959;
    background: #000000;
    border-radius: 50%;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
`;

export const CardWrapper = styled.div<{ line: number; compact?: boolean }>`
  ${neumorphismDark};
  padding: ${p => (p.compact ? '12px' : '24px')};
  width: ${p => (p.compact ? '100%' : 'auto')};
  height: ${p => (p.compact ? '100%' : 'auto')};

  position: relative;
  overflow: hidden;
`;
