import React, { useEffect } from 'react';
import logo from '../../assets/logo/logo-white.png';
import {
  DescriptionText,
  SignInButton,
  WelcomeContainer,
  WelcomeTitle,
} from './WelcomeSidebar.styles';
import { postVsCodeMessage } from '../../utils/vscodeApi';
import { useAuthContext } from '../../contexts/AuthContext';
import { openSidebar } from '../panel/TestPanel';
import { SIDEBAR_TYPES } from '../../constants';

export const WelcomeSidebar = () => {
  const { session } = useAuthContext();

  useEffect(() => {
    if (session) {
      openSidebar(SIDEBAR_TYPES.PROFILE);
    }
  }, [session]);

  const onGithubLogin = async () => {
    // openSidebar(SIDEBAR_TYPES.PROFILE);
    try {
      postVsCodeMessage({
        command: 'authenticate',
      });
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  };

  return (
    <WelcomeContainer>
      <section>
        <WelcomeTitle>Welcome!</WelcomeTitle>
      </section>

      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <img
          style={{
            maxWidth: '140px',
            height: 'auto',
          }}
          src={logo}
          alt="App Logo"
        />
      </section>

      <section>
        <DescriptionText>
          <p>Find your</p>
          <p>Love</p>
          <p>Friend</p>
          <p>Co-worker</p>
        </DescriptionText>
      </section>

      <SignInButton type="button" onClick={onGithubLogin}>
        Continue With GitHub
      </SignInButton>
    </WelcomeContainer>
  );
};
