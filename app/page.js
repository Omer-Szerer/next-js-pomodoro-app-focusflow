import React from 'react';
import Tasks from './components/TaskList';
// import PomodoroTimer from './components/PomodoroTimer';
import Timers from './components/Timers';

export default function Home() {
  return (
    <main>
      {/* <PomodoroTimer /> */}
      <Timers />
      <Tasks />
    </main>
  );
}
