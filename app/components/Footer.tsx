import React from 'react';
import styles from '../styles/Footer.module.scss';
import GitHubIcon from './GitHubIcon';
import LinkedinIcon from './LinkedinIcon';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>Made with ❤️ by Omer Szerer</p>
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
      </div>
    </footer>
  );
};

export default Footer;
