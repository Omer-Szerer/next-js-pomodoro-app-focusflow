'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/ExerciseTimer.module.scss';
import StartPauseButton from './StartPauseButton';

export default function ExerciseTimer() {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes default
  const [isActive, setIsActive] = useState(false); // Initially paused

  // Format time in MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Play alarm sound
  const playAlarm = async () => {
    try {
      const audio = new Audio('/sounds/alarm-calm.wav');
      await audio.play();
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  };

  // Toggle start/pause
  const toggleTimer = () => {
    setIsActive((prevActive) => !prevActive);
  };

  // Effect to handle countdown
  useEffect(() => {
    let timer;

    // Async function to handle timer end logic
    const handleTimerEnd = async () => {
      await playAlarm(); // Wait for the sound to play
      setIsActive(false); // Pause timer
    };

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Directly call the async function here
      handleTimerEnd().catch((error) =>
        console.error('Error handling timer end:', error),
      );
    }

    return () => clearInterval(timer); // Cleanup on unmount
  }, [isActive, timeLeft]);

  return (
    <div className={styles.container}>
      <h1>{formatTime(timeLeft)}</h1>
      <StartPauseButton
        isRunning={isActive}
        onClick={toggleTimer}
        size="small"
      />
    </div>
  );
}
