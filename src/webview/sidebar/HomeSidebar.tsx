// ProfileSidebar.tsx
import React, { useState } from 'react';
import gopher from '../../assets/profileImage/gopher.png';
import styled from '@emotion/styled';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../components/badge';

// — styled components — //

const Container = styled.div`
  width: 100vw;
  margin-top: 30px;
  padding: 24px;
  background: #181818;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ProfileWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 16px;
  box-shadow: 8px 8px 16px #000000, -8px -8px 16px #1f1f1f;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #ffffff;
`;

const SubInfo = styled.p`
  margin: 4px 0 16px;
  color: #bbbbbb;
  font-size: 14px;
`;

const BadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

// const Badge = styled.span`
//   padding: 4px 8px;
//   background: #1f1f1f;
//   border-radius: 12px;
//   font-size: 12px;
//   color: #ffffff;
//   box-shadow: 2px 2px 4px #000000, -2px -2px 4px #1f1f1f;
// `;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
`;

const PrimaryButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: #1f1f1f;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 4px 4px 8px #000000, -4px -4px 8px #1f1f1f;

  &:active {
    box-shadow: inset 4px 4px 8px #000000, inset -4px -4px 8px #1f1f1f;
    transform: translateY(2px);
`;

const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  border: 1px solid #333333;
  color: #bbbbbb;
  &:active {
    /* same inset shadow, but keep the border visible */
    box-shadow: inset 4px 4px 8px #000000, inset -4px -4px 8px #1f1f1f;
    transform: translateY(2px);
  }
`;

const ChatsSection = styled.div`
  margin-top: 20px;
`;

const ChatToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  color: #ffffff;
  &:hover {
    background: #1f1f1f;
  }
`;

const ToggleIcon = styled.span`
  font-size: 18px;
  margin-right: 8px;
`;

const ToggleLabel = styled.span`
  font-size: 16px;
`;

const ChatList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  background: #1f1f1f;
  padding: 8px;
  border-radius: 8px;
  box-shadow: inset 2px 2px 4px #000000, inset -2px -2px 4px #1f1f1f;
`;

const ChatAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  box-shadow: 2px 2px 4px #000000, -2px -2px 4px #1f1f1f;
`;

const ChatInfo = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatName = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
`;

const ChatPreview = styled.div`
  font-size: 12px;
  color: #bbbbbb;
`;

// — component — //

interface ChatItemType {
  id: string;
  name: string;
  gender: string;
  age: number;
  lastMessage: string;
  avatarUrl: string;
}

const mockChats: ChatItemType[] = [
  {
    id: '1',
    name: 'John4321',
    gender: 'Male',
    age: 26,
    lastMessage: 'Your code looks good to me. Hello ...',
    avatarUrl: '/assets/profileImage/gopher.png',
  },
];

export const HomeSidebar: React.FC = () => {
  const [openChats, setOpenChats] = useState(false);
  const {} = useAuth();

  return (
    <Container>
      <ProfileWrapper>
        <ProfileSection>
          <ProfileImage src={gopher} />
          <Name>John1234</Name>
          <SubInfo>Male, 26</SubInfo>
          <BadgesContainer>
            <Badge text="Python" />
          </BadgesContainer>
        </ProfileSection>

        <Buttons>
          <PrimaryButton>Edit Profile</PrimaryButton>
          <SecondaryButton>My Codes</SecondaryButton>
        </Buttons>

        <ChatsSection>
          <ChatToggle onClick={() => setOpenChats(!openChats)}>
            <ToggleIcon>💬</ToggleIcon>
            <ToggleLabel>Chats</ToggleLabel>
          </ChatToggle>

          {openChats && (
            <ChatList>
              {mockChats.map(chat => (
                <ChatItem key={chat.id}>
                  <ChatAvatar src={chat.avatarUrl} />
                  <ChatInfo>
                    <ChatName>
                      {chat.name} ({chat.gender}, {chat.age})
                    </ChatName>
                    <ChatPreview>{chat.lastMessage}</ChatPreview>
                  </ChatInfo>
                </ChatItem>
              ))}
            </ChatList>
          )}
        </ChatsSection>
      </ProfileWrapper>
    </Container>
  );
};

export default HomeSidebar;
