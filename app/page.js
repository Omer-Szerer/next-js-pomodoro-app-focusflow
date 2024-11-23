// import { redirect } from 'next/navigation';
import React from 'react';
import { getCookie } from '../util/cookies';
import Tasks from './components/TaskList';
import Timers from './components/Timers';
import { getExercisesInsecure } from './database/exercises';
import { getTasks } from './database/tasks';
import { getUser } from './database/users';

export default async function HomePage() {
  const exercises = await getExercisesInsecure();
  // Task: Restrict access to the notes page and only display notes belonging to the current logged in user
  // 1. Check if the sessionToken cookie exists
  const sessionTokenCookie = await getCookie('sessionToken');

  // 2. Query user with the sessionToken
  const user = sessionTokenCookie && (await getUser(sessionTokenCookie));

  // --- THIS CAUSES THE APP TO CRASH --- //
  // 3. If the user does not exist, redirect to the login with the returnTo query parameter
  // if (!user) {
  //   redirect(`/?modal=login`);
  // }

  // 4. Display the tasks for the current logged in user
  const tasks = await getTasks(sessionTokenCookie);

  return (
    <main>
      <Timers exercises={exercises} />
      <Tasks user={user} tasks={tasks} />
    </main>
  );
}
