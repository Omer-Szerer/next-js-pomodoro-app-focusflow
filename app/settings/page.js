import React from 'react';
import Settings from '../components/Settings';
import { TimerSettingsProvider } from '../contexts/TimerSettingsContext';

export const metadata = {
  title: 'FocusFlow | For Body & Mind',
  description: 'A Pomodoro App that keeps your body and mind active',
};

export default function SettingsPage() {
  return (
    <TimerSettingsProvider>
      <Settings />
    </TimerSettingsProvider>
  );
}
