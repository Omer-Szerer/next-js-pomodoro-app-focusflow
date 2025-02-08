'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTimerSettings } from '../contexts/TimerSettingsContext';
import styles from '../styles/Timer.module.scss';
import SelectedExerciseContainer from './SelectedExerciseContainer';
import StartPauseButton from './StartPauseButton';

export default function Timers({ exercises }) {
  const { focusTime, shortBreakTime, longBreakTime, rounds } =
    useTimerSettings();

  const [timeLeft, setTimeLeft] = useState(focusTime);
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

  const updateTimeLeft = useCallback(() => {
    if (sessionType === 'Focus') {
      setTimeLeft(focusTime);
    } else if (sessionType === 'Short Break') {
      setTimeLeft(shortBreakTime);
    } else if (sessionType === 'Long Break') {
      setTimeLeft(longBreakTime);
    }
  }, [focusTime, shortBreakTime, longBreakTime, sessionType]);

  useEffect(() => {
    updateTimeLeft();
  }, [updateTimeLeft]);

  const switchToSession = (session) => {
    setIsRunning(false);
    setBreakChoice('');
    setHasChosenBreak(false);

    console.log(`Switching to session: ${session}`);

    if (session === 'Focus') {
      setSessionType('Focus');
    } else if (session === 'Short Break') {
      setSessionType('Short Break');
    } else {
      setSessionType('Long Break');
    }
  };

  const startStopTimer = () => {
    if (sessionType === 'Short Break' && !isRunning) {
      setShowBreakPrompt(true);
      console.log('Break modal should now be visible'); // Debugging
    }
    setIsRunning((prev) => !prev);
  };
  // const startStopTimer = () => {
  //   setIsRunning((prev) => !prev);
  // };

  const handleSessionSwitch = useCallback(() => {
    setBreakChoice('');
    setHasChosenBreak(false);

    if (sessionType === 'Focus') {
      setSessionCount((prevCount) => prevCount + 1);
      if (sessionCount === rounds - 1) {
        setSessionType('Long Break');
        setTimeLeft(longBreakTime);
      } else {
        setSessionType('Short Break');
        setTimeLeft(shortBreakTime);
      }
    } else {
      setSessionType('Focus');
      setTimeLeft(focusTime);
    }
    setIsRunning(false);
  }, [
    sessionType,
    sessionCount,
    longBreakTime,
    shortBreakTime,
    focusTime,
    rounds,
  ]);

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

  const remainingRounds = Math.max(0, rounds - sessionCount);

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
            onClick={() => {
              console.log('Short Break button clicked'); // Debugging
              switchToSession('Short Break');
            }}
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
          {sessionType === 'Focus' && sessionCount === rounds - 1 ? (
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
