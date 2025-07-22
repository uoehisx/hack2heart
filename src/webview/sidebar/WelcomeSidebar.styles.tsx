import styled from '@emotion/styled';

export const WelcomeContainer = styled.div`
  width: 250px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WelcomeTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #6a4bff;
`;

export const DescriptionText = styled.h3`
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  white-space: normal;
  margin: 0;
`;

export const SignInButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  border: none;
  padding: 10px 14px;
  font-size: 14px;
  font-family: 'My Font SemiBold', sans-serif;
  background: #6a4bff;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  width: 220px;

  &:active {
    box-shadow: inset 4px 4px 8px #5a40d9, inset -4px -4px 8px #7a56ff;
    transform: translateY(2px);
  }
`;
