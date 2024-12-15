import React from 'react';
import { getCookie } from '../util/cookies';
import Tasks from './components/TaskList';
import Timers from './components/Timers';
import { ThemeProvider } from './contexts/ThemeContext';
import { TimerSettingsProvider } from './contexts/TimerSettingsContext';
import { getExercisesInsecure } from './database/exercises';
import { getTasksWithSubtasks } from './database/tasks';
import { getUser } from './database/users';

export default async function HomePage() {
  const exercises = await getExercisesInsecure();
  // Task: Restrict access to the notes page and only display notes belonging to the current logged in user
  // 1. Check if the sessionToken cookie exists
  const sessionTokenCookie = await getCookie('sessionToken');

  // 2. Query user with the sessionToken
  const user = sessionTokenCookie && (await getUser(sessionTokenCookie));

  // 3. Display the tasks for the current logged in user
  const taskWithSubtask = await getTasksWithSubtasks(sessionTokenCookie);

  return (
    <main>
      <ThemeProvider>
        <TimerSettingsProvider>
          <Timers exercises={exercises} />
          <Tasks user={user} taskWithSubtask={taskWithSubtask} />
        </TimerSettingsProvider>
      </ThemeProvider>
    </main>
  );
}
