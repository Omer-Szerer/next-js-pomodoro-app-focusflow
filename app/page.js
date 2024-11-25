import React from 'react';
import { getCookie } from '../util/cookies';
import Tasks from './components/TaskList';
import Timers from './components/Timers';
import { getExercisesInsecure } from './database/exercises';
import { getSubtasks } from './database/subtasks';
import { getTasks } from './database/tasks';
import { getUser } from './database/users';

export const metadata = {
  title: 'FocusFlow |',
  description: 'A Pomodoro App that keeps your body and mind active',
};

export default async function HomePage() {
  const exercises = await getExercisesInsecure();
  // Task: Restrict access to the notes page and only display notes belonging to the current logged in user
  // 1. Check if the sessionToken cookie exists
  const sessionTokenCookie = await getCookie('sessionToken');

  // 2. Query user with the sessionToken
  const user = sessionTokenCookie && (await getUser(sessionTokenCookie));

  // 3. Display the tasks for the current logged in user
  const tasks = await getTasks(sessionTokenCookie);
  const subTasks = await getSubtasks(sessionTokenCookie);

  return (
    <main>
      <Timers exercises={exercises} />
      <Tasks user={user} tasks={tasks} subtasks={subTasks} />
    </main>
  );
}
