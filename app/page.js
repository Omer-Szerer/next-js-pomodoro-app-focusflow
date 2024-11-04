import React from 'react';
import Tasks from './components/TaskList';
import TaskList from './components/TaskListDnD';
import PomodoroTimer from './components/Timer';

// import AnimationTest from './components/AnimationTest';
// import PomoTimer from './components/PomoTimer';
// import { settingsContext } from './components/SettingsContext';

export default function Home() {
  return (
    <main>
      {/* <AnimationTest /> */}
      {/* <PomoTimer /> */}
      {/* <settingsContext.Provider value={{}} /> */}
      <PomodoroTimer />
      <TaskList />
      <Tasks />
    </main>
  );
}
