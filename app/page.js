import React from 'react';
import SelectedExerciseContainer from './components/SelectedExerciseContainer';
import Tasks from './components/TaskList';
import Timers from './components/Timers';

export default function HomePage() {
  return (
    <main>
      <Timers />
      <SelectedExerciseContainer />
      <Tasks />
    </main>
  );
}
