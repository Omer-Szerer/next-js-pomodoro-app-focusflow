import { cache } from 'react';
import type { Session } from '../../migrations/00003-sessions';
import type { Task } from '../../migrations/00004-createTableTasks';
import { sql } from './connect';

export const getTasks = cache(async (sessionToken: string) => {
  const tasks = await sql<Task[]>`
    SELECT
      tasks.*
    FROM
      tasks
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND sessions.user_id = tasks.user_id
        AND expiry_timestamp > now()
      )
  `;
  return tasks;
});

export const getTask = cache(async (sessionToken: string, taskId: number) => {
  const [task] = await sql<Task[]>`
    SELECT
      tasks.*
    FROM
      tasks
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND sessions.user_id = tasks.user_id
        AND expiry_timestamp > now()
      )
    WHERE
      tasks.id = ${taskId}
  `;
  return task;
});

export const createTask = cache(
  async (sessionToken: Session['token'], textContent: string) => {
    const [task] = await sql<Task[]>`
      INSERT INTO
        tasks (user_id, text_content) (
          SELECT
            sessions.user_id,
            ${textContent}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        tasks.*
    `;

    return task;
  },
);
