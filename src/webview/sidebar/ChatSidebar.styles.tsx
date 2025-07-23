import styled from '@emotion/styled';

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

export const Header = styled.h3`
  font-size: 20px;
  color: #e0e0e0;
`;

export const MessagesContainer = styled.div`
  width: 100%;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  margin: 80px 0;
`;

export const Bubble = styled.div<{ self: boolean }>`
  max-width: 220px;
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: ${({ self }) => (self ? '#1f1f1f' : '#e0e0e0')};
  background: ${({ self }) => (self ? '#f2f2f2' : '#3a3a3a')};
  box-shadow: ${({ self }) =>
    self ? '' : 'inset 4px 4px 8px #2e2e2e, inset -4px -4px 8px #424242'};
  align-self: ${({ self }) => (self ? 'flex-end' : 'flex-start')};
`;

export const InputArea = styled.form`
  position: fixed;
  bottom: 30px;
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const TextField = styled.input`
  margin-left: 20px;
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  background: #2e2e2e;
  box-shadow: inset 4px 4px 8px #262626, inset -4px -4px 8px #363636;
  color: #e0e0e0;
`;

export const SendButton = styled.button`
  margin-right: 20px;
  padding: 0 20px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  background: #2e2e2e;
  color: #e0e0e0;
  transition: all 0.05s ease;

  &:active {
    box-shadow: inset 2px 2px 4px #000000, inset -2px -2px 4px #1f1f1f;
    transform: translateY(2px);
  }
`;
