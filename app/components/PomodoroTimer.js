'use client';
import React, { useCallback, useEffect, useState } from 'react';

const FOCUS_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('Focus'); // 'Focus', 'Short Break', 'Long Break'
  const [sessionCount, setSessionCount] = useState(0); // Track completed focus sessions

  const switchToSession = (session) => {
    setIsRunning(false); // Stop the timer when switching sessions
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
    setIsRunning(false); // Stop timer after session switches
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

    return () => clearInterval(timer); // Cleanup timer
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
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* Timer switcher buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => switchToSession('Focus')}
          disabled={(isRunning && timeLeft > 0) || sessionType === 'Focus'}
          style={{ opacity: isRunning && timeLeft > 0 ? 0.5 : 1 }}
        >
          Focus Time
        </button>
        <button
          onClick={() => switchToSession('Short Break')}
          disabled={
            (isRunning && timeLeft > 0) || sessionType === 'Short Break'
          }
          style={{ opacity: isRunning && timeLeft > 0 ? 0.5 : 1 }}
        >
          Short Break
        </button>
        <button
          onClick={() => switchToSession('Long Break')}
          disabled={(isRunning && timeLeft > 0) || sessionType === 'Long Break'}
          style={{ opacity: isRunning && timeLeft > 0 ? 0.5 : 1 }}
        >
          Long Break
        </button>
      </div>

      <h2>{sessionType} Session</h2>
      <div style={{ fontSize: '48px', margin: '20px 0' }}>
        {formatTime(timeLeft)}
      </div>
      <button onClick={startStopTimer}>{isRunning ? 'Pause' : 'Start'}</button>
    </div>
  );
};

export default PomodoroTimer;
