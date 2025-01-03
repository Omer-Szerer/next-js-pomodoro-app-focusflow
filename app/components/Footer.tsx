'use client';
import React, { useState } from 'react';
import styles from '../styles/Footer.module.scss';
import BehanceIcon from './BehanceIcon';
import GitHubIcon from './GitHubIcon';
import LinkedinIcon from './LinkedinIcon';

const Footer: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleHeartClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHeartClick();
    }
  };

  return (
    <footer className={styles.footer}>
      <p>
        Made with{' '}
        <span
          className={`${styles.heart} ${isClicked ? styles.clicked : ''}`}
          onClick={handleHeartClick}
          onKeyDown={handleKeyDown}
          tabIndex={0} // Makes the element focusable
          role="button" // Indicates interactivity
          aria-label="Click to animate heart emoji"
        >
          ❤️
        </span>{' '}
        by Omer Szerer
      </p>
      <div>
        <a
          className="github"
          href="https://github.com/Omer-Szerer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
        <a
          className="linkedin"
          href="https://www.linkedin.com/in/omer-szerer/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon />
        </a>
        <a
          className="Behance"
          href="https://www.behance.net/gallery/215267877/FocusFlow-Full-Stack-Pomodoro-App"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BehanceIcon />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
