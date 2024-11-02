'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Timer.module.scss';

const FOCUS_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('Focus');
  const [sessionCount, setSessionCount] = useState(0);

  const switchToSession = (session) => {
    setIsRunning(false);
    if (session === 'Focus') {
      setSessionType('Focus');
      setTimeLeft(FOCUS_TIME);
    } else if (session === 'Short Break') {
      setSessionType('Short Break');
      setTimeLeft(SHORT_BREAK);
    } else if (session === 'Long Break') {
      setSessionType('Long Break');
      setTimeLeft(LONG_BREAK);
    }
  };

  const handleSessionSwitch = useCallback(() => {
    if (sessionType === 'Focus') {
      setSessionCount((prevCount) => prevCount + 1);
      if (sessionCount === 3) {
        setSessionType('Long Break');
        setTimeLeft(LONG_BREAK);
        setSessionCount(0);
      } else {
        setSessionType('Short Break');
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      setSessionType('Focus');
      setTimeLeft(FOCUS_TIME);
    }
    setIsRunning(false);
  }, [sessionType, sessionCount]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionSwitch();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, handleSessionSwitch]);

  const startStopTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.switcherButton} ${sessionType === 'Focus' ? styles.active : styles.inactive}`}
          onClick={() => switchToSession('Focus')}
          disabled={isRunning && timeLeft > 0}
        >
          Focus
        </button>
        <button
          className={`${styles.switcherButton} ${sessionType === 'Short Break' ? styles.active : styles.inactive}`}
          onClick={() => switchToSession('Short Break')}
          disabled={isRunning && timeLeft > 0}
        >
          Short Break
        </button>
        <button
          className={`${styles.switcherButton} ${sessionType === 'Long Break' ? styles.active : styles.inactive}`}
          onClick={() => switchToSession('Long Break')}
          disabled={isRunning && timeLeft > 0}
        >
          Long Break
        </button>
      </div>

      <div className={styles.timerDisplay}>{formatTime(timeLeft)}</div>
      <button className={styles.startPauseButton} onClick={startStopTimer}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  );
};

export default PomodoroTimer;
