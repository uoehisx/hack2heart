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
import githubIconWhite from '../../assets/images/github-logo-white.png';

export const WelcomeSidebar = () => {
  const { session } = useAuthContext();

  useEffect(() => {
    if (session?.serviceToken) {
      openSidebar(SIDEBAR_TYPES.HOME);
    }
  }, [session]);

  const onGithubLogin = async () => {
    // openSidebar(SIDEBAR_TYPES.PROFILE);
    try {
      postVsCodeMessage({
        type: 'authenticate',
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
            maxWidth: '160px',
            height: 'auto',
          }}
          src={logo}
          alt="App Logo"
        />
      </section>

      <section>
        <DescriptionText>
          <p>Find your</p>
          <p style={{ color: 'white' }}>Love</p>
          <p style={{ color: 'white' }}>Friend</p>
          <p style={{ color: 'white' }}>Co-worker</p>
          <p>
            At <span style={{ color: '#6a4bff' }}>Hack2Heart</span>
          </p>
        </DescriptionText>
      </section>

      <SignInButton type="button" onClick={onGithubLogin}>
        <img
          src={githubIconWhite}
          style={{
            width: '16px',
            height: '16px',
            marginRight: '8px',
          }}
        ></img>
        <span>Continue With GitHub</span>
      </SignInButton>
    </WelcomeContainer>
  );
};
