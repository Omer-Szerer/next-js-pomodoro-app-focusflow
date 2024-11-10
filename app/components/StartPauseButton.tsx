import React from 'react';
import styles from '../styles/StartPauseButton.module.scss';

interface StartPauseButtonProps {
  isRunning: boolean;
  onClick: () => void;
  size?: 'small' | 'default';
}

const StartPauseButton: React.FC<StartPauseButtonProps> = ({
  isRunning,
  onClick,
  size = 'default',
}) => {
  return (
    <button
      className={`${styles.startPauseButton} ${isRunning ? styles.paused : styles.running} ${
        size === 'small' ? styles.smallButton : ''
      }`}
      onClick={onClick}
    >
      {isRunning ? 'Pause' : 'Start'}
    </button>
  );
};

export default StartPauseButton;
