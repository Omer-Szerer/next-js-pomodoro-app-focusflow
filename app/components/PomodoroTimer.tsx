'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Timer.module.scss';
import SelectedExerciseCard from './SelectedExerciseCard';
import StartPauseButton from './StartPauseButton';

const FOCUS_TIME = 60 * 25;
const SHORT_BREAK = 60 * 5;
const LONG_BREAK = 60 * 20;

// const FOCUS_TIME = 2;
// const SHORT_BREAK = 5;
// const LONG_BREAK = 2;

type SessionType = 'Focus' | 'Short Break' | 'Long Break';

interface PomodoroTimerProps extends Record<string, never> {}

const PomodoroTimer: React.FC<PomodoroTimerProps> = () => {
  const [timeLeft, setTimeLeft] = useState<number>(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<SessionType>('Focus');
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState<boolean>(false);
  const [breakChoice, setBreakChoice] = useState<string>('');

  const switchToSession = (session: 'Focus' | 'Short Break' | 'Long Break') => {
    setIsRunning(false);
    setBreakChoice(''); // Clear the old exercise when switching sessions

    if (session === 'Focus') {
      setSessionType('Focus');
      setTimeLeft(FOCUS_TIME);
    } else if (session === 'Short Break') {
      setSessionType('Short Break');
      setTimeLeft(SHORT_BREAK);
    } else {
      // Default to 'Long Break' if neither 'Focus' nor 'Short Break'
      setSessionType('Long Break');
      setTimeLeft(LONG_BREAK);
    }
  };

  const handleSessionSwitch = useCallback(() => {
    setBreakChoice('');
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
    let timer: ReturnType<typeof setInterval>;
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

  const handleBreakChoice = (choice: string) => {
    console.log(`Chosen break type: ${choice}`);
    setBreakChoice(choice);
    setShowBreakPrompt(false);
    setIsRunning(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

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
          <StartPauseButton isRunning={isRunning} onClick={startStopTimer} />

          {sessionType === 'Focus' && sessionCount === 3 ? (
            <p className={styles.motivationMessage}>
              Keep on! Long break is almost there!
            </p>
          ) : sessionType === 'Focus' ? (
            <p className={styles.remainingRoundsText}>
              {remainingRounds} {remainingRounds === 1 ? 'round' : 'rounds'}{' '}
              left for the big break
            </p>
          ) : null}
        </div>
      </div>
      {showBreakPrompt && (
        <div className={styles.modal}>
          <p>Choose a break type:</p>
          <div className={styles.modalButtonGroup}>
            <button onClick={() => handleBreakChoice('Physical')}>
              Physical
            </button>
            <button onClick={() => handleBreakChoice('Breathing')}>
              Breathing
            </button>
            <button onClick={() => handleBreakChoice('Stretch')}>
              Stretch
            </button>
            <button onClick={() => handleBreakChoice('Meditation')}>
              Meditation
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
      {breakChoice && <SelectedExerciseCard breakType={breakChoice} />}
    </>
  );
};

export default PomodoroTimer;
