import React from 'react';
// import TaskListDnD from './components/TaskListDnD';
import PomodoroTimer from './components/PomodoroTimer';
import Tasks from './components/TaskList';

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
      {/* <TaskListDnD /> */}
      <Tasks />
    </main>
  );
}
