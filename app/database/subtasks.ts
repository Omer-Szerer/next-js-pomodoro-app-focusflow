import { cache } from 'react';
import type { Session } from '../../migrations/00003-sessions';
import type { Subtask } from '../../migrations/00005-createTableSubtasks';
import { sql } from './connect';

export type ExtendedSubtask = Subtask & {
  checked: boolean;
};

// Fetch all subtasks for a specific task
export const getSubtasks = cache(
  async (sessionToken: string, taskId: number) => {
    const subtasks = await sql<
      { id: number; taskId: number; textContent: string; checked: boolean }[]
    >`
      SELECT
        subtasks.*
      FROM
        subtasks
        INNER JOIN tasks ON (subtasks.task_id = tasks.id)
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = tasks.user_id
          AND expiry_timestamp > now()
        )
      WHERE
        subtasks.task_id = ${taskId}
    `;
    return subtasks;
  },
);

// Fetch a single subtask
export const getSubtask = cache(
  async (sessionToken: string, subtaskId: number) => {
    const [subtask] = await sql<
      { id: number; taskId: number; textContent: string; checked: boolean }[]
    >`
      SELECT
        subtasks.*
      FROM
        subtasks
        INNER JOIN tasks ON (subtasks.task_id = tasks.id)
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = tasks.user_id
          AND expiry_timestamp > now()
        )
      WHERE
        subtasks.id = ${subtaskId}
    `;
    return subtask;
  },
);

// Create a new subtask
export const createSubtask = cache(
  async (
    sessionToken: Session['token'],
    taskId: number,
    textContent: string,
    checked = false, // Default value for new subtasks
  ) => {
    const [subtask] = await sql<
      { id: number; taskId: number; textContent: string; checked: boolean }[]
    >`
      INSERT INTO
        subtasks (
          task_id,
          text_content,
          checked
        ) (
          SELECT
            ${taskId},
            ${textContent},
            ${checked}
          FROM
            sessions
            INNER JOIN tasks ON (
              tasks.id = ${taskId}
              AND tasks.user_id = sessions.user_id
            )
          WHERE
            sessions.token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        subtasks.*
    `;
    return subtask;
  },
);

// Update the checked status of a subtask
export const updateSubtaskCheckedStatus = cache(
  async (
    sessionToken: Session['token'],
    subtaskId: number,
    checked: boolean,
  ) => {
    const [updatedSubtask] = await sql<
      { id: number; taskId: number; textContent: string; checked: boolean }[]
    >`
      UPDATE subtasks
      SET
        checked = ${checked}
      WHERE
        id = ${subtaskId}
        AND task_id IN (
          SELECT
            tasks.id
          FROM
            tasks
            INNER JOIN sessions ON (
              sessions.token = ${sessionToken}
              AND sessions.user_id = tasks.user_id
              AND sessions.expiry_timestamp > now()
            )
        )
      RETURNING
        subtasks.*
    `;
    return updatedSubtask;
  },
);

// Delete a subtask
export const deleteSubtask = async (
  sessionToken: string,
  subtaskId: number,
): Promise<boolean> => {
  try {
    // Check if subtask exists for the current user's session
    const subtask = await sql<
      { id: number; taskId: number; textContent: string; checked: boolean }[]
    >`
      SELECT
        subtasks.*
      FROM
        subtasks
        INNER JOIN tasks ON (subtasks.task_id = tasks.id)
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = tasks.user_id
          AND sessions.expiry_timestamp > now()
        )
      WHERE
        subtasks.id = ${subtaskId}
    `;

    if (subtask.length === 0) {
      return false; // Subtask not found or user doesn't have permission
    }

    // Attempt to delete the subtask
    const deleteResult = await sql<
      { id: number; taskId: number; textContent: string; checked: boolean }[]
    >`
      DELETE FROM subtasks
      WHERE
        id = ${subtaskId}
      RETURNING
        *
    `;
    return deleteResult.length > 0; // Returns true if rows are deleted
  } catch (error) {
    console.error('Error deleting subtask:', error);
    throw new Error('Failed to delete subtask');
  }
};
