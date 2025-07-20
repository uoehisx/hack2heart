// src/components/Welcome/Welcome.tsx
import React from 'react';
import styles from './Welcome.module.css';
import logo from '../../../assets/logo/logo.png';

interface WelcomeProps {
  title: string;
  description: string; // \n 으로 줄바꿈 포함 가능
  onGithubLogin?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ title, description, onGithubLogin }) => {
  return (
    <div className={styles.container}>
      <section className={styles.titleSection}>
        <h2 className={styles.title}>{title}</h2>
      </section>

      <section className={styles.logoSection}>
        <img className={styles.logo} src={logo} alt="App Logo" />
      </section>

      <section className={styles.descriptionSection}>
        <h3 className={styles.description}>
          {description.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i !== description.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h3>
      </section>

      <button
        className={styles.signinButton}
        type="button"
        onClick={onGithubLogin}
      >
        Continue With GitHub
      </button>
    </div>
  );
};

export default Welcome;
