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

export const deleteTask = async (
  sessionTokenCookie: string,
  taskId: number,
): Promise<boolean> => {
  try {
    console.log('Checking if task exists for ID:', taskId);

    // Check if task exists for the current user
    const task = await sql<
      { id: number; userId: number; textContent: string }[]
    >`
      SELECT
        tasks.*
      FROM
        tasks
        INNER JOIN sessions ON (
          sessions.token = ${sessionTokenCookie}
          AND sessions.user_id = tasks.user_id
          AND sessions.expiry_timestamp > now()
        )
      WHERE
        tasks.id = ${taskId}
    `;

    console.log('Task found:', task);

    if (task.length === 0) {
      console.log("Task not found or user doesn't have permission");
      return false;
    }

    // Attempt to delete the task
    const deleteResult = await sql<
      { id: number; userId: number; textContent: string }[]
    >`
      DELETE FROM tasks
      WHERE id = ${taskId}
      RETURNING *
    `;

    console.log('Delete result:', deleteResult);

    return deleteResult.length > 0; // Returns true if rows are deleted
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};
