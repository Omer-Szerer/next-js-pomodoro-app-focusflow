'use client';
import React, { useCallback, useEffect, useState } from 'react';
import SelectedExerciseCard from '../components/SelectedExerciseCard';
import styles from '../styles/Timer.module.scss';

const FOCUS_TIME = 60 * 25;
const SHORT_BREAK = 60 * 5;
const LONG_BREAK = 60 * 20;

// const FOCUS_TIME = 2;
// const SHORT_BREAK = 5;
// const LONG_BREAK = 2;

const TimerOld = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('Focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [breakChoice, setBreakChoice] = useState('');

  const switchToSession = (session) => {
    setIsRunning(false);
    setBreakChoice(''); // Clear the old exercise when switching sessions
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
    setBreakChoice(''); // Clear the old exercise when switching sessions
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
      setShowBreakPrompt(true); // Show break prompt
      // Do NOT start the timer here; wait for user's choice
    } else {
      setIsRunning(!isRunning); // Toggle the timer state (start/pause) for other sessions
    }
  };

  const handleBreakChoice = (choice) => {
    console.log(`Chosen break type: ${choice}`);
    setBreakChoice(choice); // Set the selected break type
    setShowBreakPrompt(false); // Hide the modal
    setIsRunning(true); // Start the timer after the user selects a choice
  };

  const formatTime = (time) => {
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
          <button className={styles.startPauseButton} onClick={startStopTimer}>
            {isRunning ? 'Pause' : 'Start'}
          </button>

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
      {/* Render the ExerciseCard component with the breakChoice */}
      {breakChoice && <SelectedExerciseCard breakType={breakChoice} />}
    </>
  );
};

export default TimerOld;
