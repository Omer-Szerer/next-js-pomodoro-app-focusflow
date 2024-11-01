import React from 'react';
import PomodoroTimer from './components/PomodoroTimer';

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
    </main>
  );
}
