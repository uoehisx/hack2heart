import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
} from 'react';
import {
  BackButton,
  Bubble,
  Header,
  InputArea,
  MessagesContainer,
  SendButton,
  SidebarWrapper,
  TextField,
} from './ChatSidebar.styles';
import { useSocketReceiver, useSocketSender } from '../../hooks/useSocket';
import { axiosRequest } from '../../hooks/useAxios';
import { useAuthContext } from '../../contexts/AuthContext';
import { SIDEBAR_TYPES, User } from '../../constants';
import { openSidebar } from '../panel/TestPanel';
import { Loading } from '../components/loading';

interface ChatMessage {
  chatroom_id: string;
  user_id: number;
  content: string;
  created_at: string;
}

interface ChatSidebarProps {
  chatroomId: string;
}

const ChatSidebar = ({ chatroomId = 'test' }: ChatSidebarProps) => {
  const { session } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useSocketReceiver('sent_message', (data: unknown) => {
    const incoming = data as ChatMessage;
    console.log('Received message:', incoming);
    setMessages(prev => [...prev, incoming]);
  });

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // 최초 진입 시 사용자 정보 및 메시지 목록 요청
    const fetchUserProfileAndMessages = async () => {
      console.log('serviceToken:', session?.serviceToken);
      if (session) {
        try {
          // 사용자 정보 요청
          const userRes = await axiosRequest({
            method: 'GET',
            url: '/users/me',
            headers: {
              Authorization: `Bearer ${session.serviceToken}`,
            },
          });
          setCurrentUser(userRes.data);

          // 메시지 목록 요청
          const msgRes = await axiosRequest({
            method: 'GET',
            url: `/chatrooms/${chatroomId}/messages`,
            headers: {
              Authorization: `Bearer ${session.serviceToken}`,
            },
          });
          console.log('Fetched messages:', msgRes.data);
          setMessages(msgRes.data.messages);
        } catch (err) {
          console.error('Failed to fetch data:', err);
        }
      }
    };
    fetchUserProfileAndMessages();
  }, []);

  if (!session || !currentUser) {
    return <Loading />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const optimistic: ChatMessage = {
      chatroom_id: chatroomId,
      user_id: currentUser.id,
      content: text,
      created_at: new Date().toISOString(),
    };

    await axiosRequest({
      method: 'POST',
      url: `/chatrooms/${chatroomId}/messages`,
      headers: {
        Authorization: `Bearer ${session.serviceToken}`,
      },
      data: { content: text },
    });

    setMessages(prev => [...prev, optimistic]);
    setDraft('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
  };

  return (
    <SidebarWrapper>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Header>Chat</Header>
        <BackButton
          onClick={() => {
            openSidebar(SIDEBAR_TYPES.HOME);
          }}
        >
          ← back
        </BackButton>
      </div>

      <MessagesContainer>
        {messages.map(msg => (
          <Bubble key={msg.created_at} self={msg.user_id === currentUser.id}>
            {msg.content}
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
