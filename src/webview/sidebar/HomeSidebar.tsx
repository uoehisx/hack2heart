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
  AVATAR_IMG_SRC,
  DEFAULT_AVATAR_IMG_ID,
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
  lastMessage: string | null;
  avatarId: number | null;
}

export const HomeSidebar: React.FC = () => {
  const { session } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatrooms, setChatrooms] = useState<ChatItemType[]>([]);
  const [openChats, setOpenChats] = useState(false);

  if (!session) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    // 최초 진입 시 사용자 정보 요청
    const fetchUserProfile = async () => {
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
    };
    fetchUserProfile();

    const fetchChatrooms = async () => {
      try {
        const chatrooms = (
          await axiosRequest({
            method: 'GET',
            url: '/users/me/chatrooms',
            headers: {
              Authorization: `Bearer ${session.serviceToken}`,
            },
          })
        ).data.chatrooms;
        console.log('Fetched chatrooms:', chatrooms);
        setChatrooms(
          chatrooms.map((chatroom: any) => ({
            id: chatroom.id,
            name: chatroom.name,
            gender: chatroom.gender,
            age: getAge(chatroom.birth_date),
            lastMessage: chatroom.last_message,
            avatarId: chatroom.avatar_id,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch chatrooms:', error);
      }
    };
    fetchChatrooms();
  }, []);

  if (!currentUser) {
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
              {chatrooms.map(chat => (
                <ChatItem
                  key={chat.id}
                  onClick={() => {
                    openSidebar(SIDEBAR_TYPES.CHAT, undefined, {
                      chatroomId: chat.id,
                    });
                  }}
                >
                  <ChatAvatar
                    src={AVATAR_IMG_SRC[chat.avatarId || DEFAULT_AVATAR_IMG_ID]}
                  />
                  <ChatInfo>
                    <ChatName>
                      {chat.name} (
                      {chat.gender === GENDER_TYPES.MALE
                        ? 'Male'
                        : GENDER_TYPES.FEMALE
                        ? 'Female'
                        : 'Other'}
                      , {chat.age})
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
