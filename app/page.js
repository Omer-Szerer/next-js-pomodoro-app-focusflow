import React from 'react';
import Tasks from './components/TaskList';
import Timers from './components/Timers';
import { getExercisesInsecure } from './database/exercises';

export default async function HomePage() {
  const exercises = await getExercisesInsecure();
  return (
    <main>
      <Timers exercises={exercises} />
      <Tasks />
    </main>
  );
}
