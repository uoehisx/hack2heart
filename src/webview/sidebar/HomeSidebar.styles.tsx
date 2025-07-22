import styled from '@emotion/styled';

export const Container = styled.div`
  margin-top: 30px;
  padding: 24px;
  background: #181818;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const ProfileWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
  align-items: center;
  justify-content: center;
`;

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 16px;
  box-shadow: 8px 8px 16px #000000, -8px -8px 16px #1f1f1f;
`;

export const Name = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #ffffff;
`;

export const SubInfo = styled.p`
  margin: 4px 0 16px;
  color: #bbbbbb;
  font-size: 14px;
`;

export const BadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

// export const Badge = styled.span`
//   padding: 4px 8px;
//   background: #1f1f1f;
//   border-radius: 12px;
//   font-size: 12px;
//   color: #ffffff;
//   box-shadow: 2px 2px 4px #000000, -2px -2px 4px #1f1f1f;
// `;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
`;

export const PrimaryButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: #1f1f1f;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 5px;
  box-shadow: 4px 4px 8px #000000, -4px -4px 8px #1f1f1f;

  &:active {
    box-shadow: inset 4px 4px 8px #000000, inset -4px -4px 8px #1f1f1f;
    transform: translateY(2px);
`;

export const SecondaryButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: #6a4bff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 5px;
  box-shadow: 4px 4px 8px #000000, -4px -4px 8px #1f1f1f;

  &:active {
    box-shadow: inset 4px 4px 8px #5a40d9, inset -4px -4px 8px #7a56ff;
    transform: translateY(2px);
  }
`;

export const ChatsSection = styled.div`
  margin-top: 20px;
`;

export const ChatToggle = styled.div`
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

export const ToggleIcon = styled.span`
  font-size: 18px;
  margin-right: 8px;
`;

export const ToggleLabel = styled.span`
  font-size: 16px;
`;

export const ChatList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  background: #1f1f1f;
  padding: 8px;
  border-radius: 8px;
  box-shadow: inset 2px 2px 4px #000000, inset -2px -2px 4px #1f1f1f;
`;

export const ChatAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  box-shadow: 2px 2px 4px #000000, -2px -2px 4px #1f1f1f;
`;

export const ChatInfo = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatName = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
`;

export const ChatPreview = styled.div`
  font-size: 12px;
  color: #bbbbbb;
`;
