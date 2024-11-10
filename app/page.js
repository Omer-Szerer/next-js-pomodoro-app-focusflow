import React from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import Tasks from './components/TaskList';

export default function Home() {
  return (
    <main>
      <PomodoroTimer />
      <Tasks />
    </main>
  );
}
