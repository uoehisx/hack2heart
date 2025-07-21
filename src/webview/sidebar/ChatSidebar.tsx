import React, { useState, useEffect, useRef, FormEvent } from "react";
import styled from "styled-components";
import useSocketReceiver from "../../hooks/useSocketReceiver";
import useSocketSender   from "../../hooks/useSocketSender";

/* ─────────────── Types ─────────────── */
interface ChatMessage {
  id: string;
  user: string;
  text: string;
  self?: boolean;
}

/* ─────────────── Neumorphism Styled Components ─────────────── */
const SidebarWrapper = styled.div`
  width: 320px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #e0e0e0;
  box-shadow: 9px 9px 16px #bebebe, -9px -9px 16px #ffffff;
`;

const Header = styled.h3`
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #333;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
`;

const Bubble = styled.div<{ self?: boolean }>`
  max-width: 220px;
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  background: #e0e0e0;
  box-shadow: ${({ self }) =>
    self
      ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
      : "4px 4px 8px #bebebe, -4px -4px 8px #ffffff"};
  align-self: ${({ self }) => (self ? "flex-end" : "flex-start")};
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
  background: #e0e0e0;
  box-shadow: inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff;
  outline: none;
`;

const SendButton = styled.button`
  padding: 0 20px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  background: #e0e0e0;
  box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff;
  transition: all 0.15s ease;
  &:active {
    box-shadow: inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff;
  }
`;

const EVENT = "chat-message";

/* ─────────────── Component ─────────────── */
const ChatSidebar: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft]       = useState("");
  const bottomRef               = useRef<HTMLDivElement>(null);

  /* 1️⃣  수신 */
  useSocketReceiver(EVENT, (data:unknown) => {
    const incoming=data as ChatMessage;
    setMessages(prev => [...prev, incoming]);
  });

  /* 2️⃣  발신 */
  // 반환 타입을 명시적으로 캐스팅해서 타입 안전 확보
  const emitMessage = useSocketSender(EVENT) as (msg: ChatMessage) => void;

  /* 3️⃣  자동 스크롤 */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 4️⃣  전송 */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const optimistic: ChatMessage = {
      id: String(Date.now()),
      user: "me",
      text,
      self: true,
    };

    setMessages(prev => [...prev, optimistic]); // optimistic UI
    emitMessage(optimistic);                    // 서버로 emit
    setDraft("");
  };

  /* 5️⃣  렌더 */
  return (
    <SidebarWrapper>
      {/* …UI 생략… */}
    </SidebarWrapper>
  );
};

export default ChatSidebar;