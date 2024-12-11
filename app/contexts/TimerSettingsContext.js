'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const timerSettingsContext = createContext();

export function TimerSettingsProvider({ children }) {
  const [focusTime, setFocusTime] = useState(1500); // 25 minutes
  const [shortBreakTime, setShortBreakTime] = useState(300); // 5 minutes
  const [longBreakTime, setLongBreakTime] = useState(900); // 15 minutes
  const [rounds, setRounds] = useState(4); // 4 rounds

  useEffect(() => {
    // Load saved settings from localStorage
    const savedFocusTime = localStorage.getItem('focusTime');
    const savedShortBreakTime = localStorage.getItem('shortBreakTime');
    const savedLongBreakTime = localStorage.getItem('longBreakTime');
    const savedRounds = localStorage.getItem('rounds');

    if (savedRounds) setRounds(parseInt(savedRounds, 10));
    if (savedFocusTime) setFocusTime(parseInt(savedFocusTime, 10));
    if (savedShortBreakTime) {
      setShortBreakTime(parseInt(savedShortBreakTime, 10));
    }
    if (savedLongBreakTime) setLongBreakTime(parseInt(savedLongBreakTime, 10));
  }, []);

  const saveSettings = () => {
    localStorage.setItem('focusTime', focusTime);
    localStorage.setItem('shortBreakTime', shortBreakTime);
    localStorage.setItem('longBreakTime', longBreakTime);
    localStorage.setItem('rounds', rounds);
  };

  return (
    <timerSettingsContext.Provider
      value={{
        focusTime,
        shortBreakTime,
        longBreakTime,
        rounds,
        setFocusTime,
        setShortBreakTime,
        setLongBreakTime,
        setRounds,
        saveSettings,
      }}
    >
      {children}
    </timerSettingsContext.Provider>
  );
}

export function useTimerSettings() {
  return useContext(timerSettingsContext);
}
