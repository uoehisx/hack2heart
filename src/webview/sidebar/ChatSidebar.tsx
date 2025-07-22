import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import useSocketReceiver from '../../hooks/useSocketReceiver';
import useSocketSender from '../../hooks/useSocketSender';
import styled from '@emotion/styled';

/* ─────────────── Types ─────────────── */
interface ChatMessage {
  id: string;
  user: string;
  text: string;
  self?: boolean;
}

/* ─────────────── Dark Neumorphism Styled Components ─────────────── */
const SidebarWrapper = styled.div`
  width: 320px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #1f1f1f; /* 어두운 그레이 */
  box-shadow: 
    8px 8px 16px #1f1f1f,   /* 아래 오른쪽 그림자 */
    -8px -8px 16px #1f1f1f; /* 위 왼쪽 하이라이트 */
`;

const Header = styled.h3`
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #e0e0e0;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
`;

const Bubble = styled.div<{ self?: boolean }>`
  max-width: 220px;
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: #e0e0e0;
  background: #3a3a3a;   /* 연한 그레이로 변경 */
  box-shadow: ${({ self }) =>
    self
      ? 'inset 4px 4px 8px #2e2e2e, inset -4px -4px 8px #424242'
      : '4px 4px 8px #2e2e2e, -4px -4px 8px #424242'};
  align-self: ${({ self }) => (self ? 'flex-end' : 'flex-start')};
`;


const InputArea = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const TextField = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  background: #2e2e2e;
  box-shadow: inset 4px 4px 8px #262626, inset -4px -4px 8px #363636;
  color: #e0e0e0;
  outline: none;
`;

const SendButton = styled.button`
  padding: 0 20px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  background: #2e2e2e;
  box-shadow: 4px 4px 8px #262626, -4px -4px 8px #363636;
  color: #000000;
  transition: all 0.15s ease;
  &:active {
    box-shadow: inset 4px 4px 8px #ffffff, inset -4px -4px 8px #ffffff;
  }
`;

const EVENT = 'chat-message';

/* ─────────────── Component ─────────────── */
const ChatSidebar: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  /* 1️⃣  수신 */
  useSocketReceiver(EVENT, (data: unknown) => {
    const incoming = data as ChatMessage;
    setMessages(prev => [...prev, incoming]);
  });

  /* 2️⃣  발신 */
  const emitMessage = useSocketSender(EVENT) as (msg: ChatMessage) => void;

  /* 3️⃣  자동 스크롤 */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* 4️⃣  전송 */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const optimistic: ChatMessage = {
      id: String(Date.now()),
      user: 'me',
      text,
      self: true,
    };

    setMessages(prev => [...prev, optimistic]);
    emitMessage(optimistic);
    setDraft('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
  };

  /* 5️⃣  렌더 */
  return (
    <SidebarWrapper>
      <Header>Chat</Header>

      <MessagesContainer>
        {messages.map(msg => (
          <Bubble key={msg.id} self={msg.self}>
            {msg.text}
          </Bubble>
        ))}
        <div ref={bottomRef} />
      </MessagesContainer>

      <InputArea onSubmit={handleSubmit}>
        <TextField
          value={draft}
          onChange={handleChange}
          placeholder="Type a message..."
        />
        <SendButton type="submit">Send</SendButton>
      </InputArea>
    </SidebarWrapper>
  );
};

export default ChatSidebar;
