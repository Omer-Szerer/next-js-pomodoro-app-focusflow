'use client';
import React, { createContext, useContext, useState } from 'react';

const timerSettingsContext = createContext();

export const TimerSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    workDuration: 25 * 60, // in seconds
    shortBreakDuration: 5 * 60,
    longBreakDuration: 20 * 60,
  });

  return (
    <timerSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </timerSettingsContext.Provider>
  );
};

export const useTimerSettings = () => useContext(timerSettingsContext);
