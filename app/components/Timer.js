'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Timer.module.scss';

// const FOCUS_TIME = 25 * 60;
// const SHORT_BREAK = 5 * 60;
// const LONG_BREAK = 15 * 60;

const FOCUS_TIME = 2;
const SHORT_BREAK = 2;
const LONG_BREAK = 2;

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('Focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);

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
    if (
      sessionType === 'Short Break' &&
      timeLeft === SHORT_BREAK &&
      !isRunning
    ) {
      setShowBreakPrompt(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleBreakChoice = (choice) => {
    console.log(`Chosen break type: ${choice}`);
    setShowBreakPrompt(false);
    setIsRunning(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Calculate remaining rounds
  const remainingRounds = Math.max(0, 3 - sessionCount);

  return (
    <>
      {showBreakPrompt && <div className={styles.fullPageBlur} />}

      <div>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.switcherButton} ${sessionType === 'Focus' ? styles.active : styles.inactive}`}
            onClick={() => switchToSession('Focus')}
            disabled={isRunning && timeLeft > 0}
          >
            Focus Time
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

        <div className={styles.timerContainer}>
          <div className={styles.timerDisplay}>{formatTime(timeLeft)}</div>
          <button className={styles.startPauseButton} onClick={startStopTimer}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          {/* Check if we are in Focus session and will transition to Long Break next */}
          {sessionType === 'Focus' && sessionCount === 3 ? (
            <p className={styles.motivationMessage}>
              Keep on! Long break is almost there!
            </p>
          ) : sessionType === 'Focus' ? (
            <p className={styles.remainingRoundsText}>
              {remainingRounds} {remainingRounds === 1 ? 'round' : 'rounds'}{' '}
              left for the big break
            </p>
          ) : null}{' '}
          {/* Don't show anything during breaks */}
        </div>
      </div>

      {showBreakPrompt && (
        <div className={styles.modal}>
          <p>Choose a break type:</p>
          <div className={styles.modalButtonGroup}>
            <button onClick={() => handleBreakChoice('Break 1')}>
              Let’s get physical
            </button>
            <button onClick={() => handleBreakChoice('Break 2')}>
              Take a breather
            </button>
            <button onClick={() => handleBreakChoice('Break 3')}>
              Yoga time
            </button>
            <button onClick={() => handleBreakChoice('Break 4')}>
              Meditation time
            </button>
          </div>
          <button
            className={styles.normalBreakText}
            onClick={() => handleBreakChoice('Normal Break')}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleBreakChoice('Normal Break')
            }
          >
            I just want a normal break
          </button>
        </div>
      )}
    </>
  );
};

export default PomodoroTimer;
