'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../styles/Timer.module.scss';
import SelectedExerciseContainer from './SelectedExerciseContainer';
import StartPauseButton from './StartPauseButton';

const FOCUS_TIME = 60 * 25;
const SHORT_BREAK = 60 * 5;
const LONG_BREAK = 60 * 20;

export default function TimersLocalStorage({ exercises }) {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('Focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [breakChoice, setBreakChoice] = useState('');
  const [hasChosenBreak, setHasChosenBreak] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const selectedExercise = useMemo(() => {
    if (!breakChoice) return null;
    const filteredExercises = exercises.filter(
      (exercise) => exercise.category === breakChoice,
    );
    return filteredExercises.length > 0
      ? filteredExercises[Math.floor(Math.random() * filteredExercises.length)]
      : {
          id: 'default',
          name: "Enjoy your break, and don't forget to drink water!",
          category: 'General',
          description: '',
        };
  }, [breakChoice, exercises]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem('timeLeft');
      const savedRunning = localStorage.getItem('isRunning');
      const savedSession = localStorage.getItem('sessionType');
      const savedCount = localStorage.getItem('sessionCount');

      if (savedTime) setTimeLeft(JSON.parse(savedTime));
      if (savedRunning) setIsRunning(JSON.parse(savedRunning));
      if (savedSession) setSessionType(savedSession);
      if (savedCount) setSessionCount(JSON.parse(savedCount));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
      localStorage.setItem('isRunning', JSON.stringify(isRunning));
      localStorage.setItem('sessionType', sessionType);
      localStorage.setItem('sessionCount', JSON.stringify(sessionCount));
    }
  }, [timeLeft, isRunning, sessionType, sessionCount]);

  const switchToSession = (session) => {
    setIsRunning(false);
    setBreakChoice('');
    setHasChosenBreak(false);
    if (session === 'Focus') {
      setSessionType('Focus');
      setTimeLeft(FOCUS_TIME);
    } else if (session === 'Short Break') {
      setSessionType('Short Break');
      setTimeLeft(SHORT_BREAK);
    } else {
      setSessionType('Long Break');
      setTimeLeft(LONG_BREAK);
    }
  };

  const handleSessionSwitch = useCallback(() => {
    setBreakChoice('');
    setHasChosenBreak(false);
    if (sessionType === 'Focus') {
      setSessionCount((prevCount) => (prevCount + 1) % 4);
      if (sessionCount === 3) {
        setSessionType('Long Break');
        setTimeLeft(LONG_BREAK);
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

  const playSound = async () => {
    try {
      const audio = new Audio('/sounds/alarm-calm.wav');
      await audio.play();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  useEffect(() => {
    let timer;

    const handleEndOfTimer = () => {
      setShowAnimation(true);
      playSound().catch((error) =>
        console.error('Failed to play sound:', error),
      );
      setTimeout(() => setShowAnimation(false), 5000);
      handleSessionSwitch();
    };

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    } else if (timeLeft === 0) {
      handleEndOfTimer();
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
      setIsRunning((prev) => !prev);
    }
  };

  const handleBreakChoice = (choice) => {
    setBreakChoice(choice);
    setShowBreakPrompt(false);
    setIsRunning(true);
    setHasChosenBreak(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingRounds = Math.max(0, 3 - sessionCount);

  useEffect(() => {
    if (isRunning) {
      document.title = `${sessionType} - ${formatTime(timeLeft)}`;
    } else {
      document.title = 'FocusFlow | For Body & Mind';
    }

    return () => {
      document.title = 'FocusFlow | For Body & Mind';
    };
  }, [timeLeft, sessionType, isRunning]);

  return (
    <>
      {showBreakPrompt && <div className={styles.fullPageBlur} />}
      <div>
        {showAnimation && (
          <div className={styles.animationOverlay}>
            <DotLottieReact
              src="/animations/Party-Confetti.lottie"
              autoplay
              loop={false}
            />
          </div>
        )}

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
              left for the long break
            </p>
          ) : null}
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
            >
              I just want a normal break
            </button>
          </div>
        )}

        {hasChosenBreak && selectedExercise && (
          <SelectedExerciseContainer
            selectedExercise={selectedExercise}
            breakType={breakChoice}
            exercises={exercises}
          />
        )}
      </div>
    </>
  );
}
