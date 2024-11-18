import { NextResponse } from 'next/server';
import {
  type Task,
  taskSchema,
} from '../../../migrations/00004-createTableTasks';
import { getCookie } from '../../../util/cookies';
import { createTask } from '../../database/tasks';

export type CreateTaskResponseBodyPost =
  | {
      task: { textContent: Task['textContent'] };
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<CreateTaskResponseBodyPost>> {
  // Task: Create a task for the current logged in user
  // 1. Get the task data from the request
  const body = await request.json();

  // 2. Validate tasks data with zod
  const result = taskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Request does not contain task object' },
      {
        status: 400,
      },
    );
  }

  // 3. Get the token from the cookie
  const sessionTokenCookie = await getCookie('sessionToken');

  // 4. Create the task
  const newTask =
    sessionTokenCookie &&
    (await createTask(sessionTokenCookie, result.data.text_content));

  // 5. If the task creation fails, return an error
  if (!newTask) {
    return NextResponse.json(
      { error: 'Task not created or access denied creating task' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the text content of the task
  return NextResponse.json({ task: { textContent: newTask.textContent } });
}
