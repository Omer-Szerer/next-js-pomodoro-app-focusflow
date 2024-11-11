'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/ExerciseTimer.module.scss';
import StartPauseButton from './StartPauseButton';

export default function ExerciseTimer() {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes default
  const [isActive, setIsActive] = useState(false); // initially paused

  // Format time in MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // Display two digits
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle start/pause
  const toggleTimer = () => {
    setIsActive((prevActive) => !prevActive);
  };

  // Effect to handle countdown
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(timer);
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
