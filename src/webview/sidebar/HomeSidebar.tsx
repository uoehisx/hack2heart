// ProfileSidebar.tsx
import React, { useState, useEffect } from 'react';
import gopher from '../../assets/profileImage/gopher.png';
import { axiosRequest } from '../../hooks/useAxios';
import { Badge } from '../components/badge';
import {
  BadgesContainer,
  Buttons,
  ChatAvatar,
  ChatInfo,
  ChatItem,
  ChatList,
  ChatName,
  ChatPreview,
  ChatsSection,
  ChatToggle,
  Container,
  Name,
  PrimaryButton,
  ProfileImage,
  ProfileSection,
  ProfileWrapper,
  SecondaryButton,
  SubInfo,
  ToggleIcon,
  ToggleLabel,
} from './HomeSidebar.styles';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  GENDER_TYPES,
  PANEL_TYPES,
  SIDEBAR_TYPES,
  User,
} from '../../constants';
import { getAge } from '../../utils/ageUtil';
import { openPanel, openSidebar } from '../panel/TestPanel';

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
  const { session } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openChats, setOpenChats] = useState(false);

  useEffect(() => {
    // 최초 진입 시 사용자 정보 요청
    const fetchUserProfile = async () => {
      console.log('serviceToken:', session?.serviceToken);
      if (session) {
        try {
          const response = await axiosRequest({
            method: 'GET',
            url: '/users/me',
            headers: {
              Authorization: `Bearer ${session.serviceToken}`,
            },
          });

          setCurrentUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };
    fetchUserProfile();
  }, [session]);

  if (!session || !currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <ProfileWrapper>
        <ProfileSection>
          <ProfileImage src={gopher} />
          <Name>{currentUser.name || '(No Data)'}</Name>
          <SubInfo>
            {currentUser
              ? `${
                  currentUser.gender === GENDER_TYPES.MALE
                    ? 'Male'
                    : GENDER_TYPES.FEMALE
                    ? 'Female'
                    : 'Other'
                }, ${getAge(currentUser.birth_date)}`
              : '(No Data)'}
          </SubInfo>
          <BadgesContainer>
            <Badge text="Python" />
          </BadgesContainer>
        </ProfileSection>

        <Buttons>
          <PrimaryButton
            onClick={() => {
              openSidebar(SIDEBAR_TYPES.PROFILE);
            }}
          >
            Edit Profile
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              openPanel(PANEL_TYPES.MYCODE);
            }}
          >
            My Codes
          </PrimaryButton>
          <SecondaryButton
            onClick={() => {
              openPanel(PANEL_TYPES.UPLOAD);
            }}
          >
            Upload
          </SecondaryButton>
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
