import styled from '@emotion/styled';

export const WelcomeContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WelcomeTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color, purple);
`;

export const DescriptionText = styled.h3`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  white-space: normal;
  margin: 0;
`;

export const SignInButton = styled.button`
  border: none;
  padding: 10px 14px;
  font-size: 14px;
  font-family: 'My Font SemiBold', sans-serif;
  background: var(--accent-color, #6a4bff);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;

  :hover {
    background: var(--accent-color-hover, #5a3bff);
  }
`;
