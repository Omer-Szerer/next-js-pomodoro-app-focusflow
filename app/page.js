import React from 'react';
import Tasks from './components/TaskList';
// import PomodoroTimer from './components/PomodoroTimer';
import PomoTimer from './components/Timers';

export default function Home() {
  return (
    <main>
      {/* <PomodoroTimer /> */}
      <PomoTimer />
      <Tasks />
    </main>
  );
}
