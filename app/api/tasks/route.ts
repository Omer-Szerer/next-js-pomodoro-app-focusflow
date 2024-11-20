import { NextResponse } from 'next/server';
import {
  type Task,
  taskSchema,
} from '../../../migrations/00004-createTableTasks';
import { getCookie } from '../../../util/cookies';
import {
  createTask,
  deleteTask,
  updateTaskCheckedStatus,
} from '../../database/tasks';

export type CreateTaskResponseBodyPost =
  | {
      task: { textContent: Task['textContent'] };
    }
  | {
      error: string;
    };

export type DeleteTaskResponseBodyDelete =
  | {
      success: boolean;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<CreateTaskResponseBodyPost>> {
  // Task: Create a task for the current logged-in user
  const body = await request.json();

  // Validate tasks data with zod
  const result = taskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Request does not contain task object' },
      {
        status: 400,
      },
    );
  }

  // Get the token from the cookie
  const sessionTokenCookie = await getCookie('sessionToken');

  // Create the task
  const newTask =
    sessionTokenCookie &&
    (await createTask(sessionTokenCookie, result.data.text_content));

  if (!newTask) {
    return NextResponse.json(
      { error: 'Task not created or access denied creating task' },
      {
        status: 400,
      },
    );
  }

  // Return the text content of the task
  return NextResponse.json({ task: { textContent: newTask.textContent } });
}

export async function DELETE(
  request: Request,
): Promise<NextResponse<DeleteTaskResponseBodyDelete>> {
  try {
    // Log the incoming request for debugging
    console.log('DELETE request received:', request);

    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      console.log('No taskId provided');
      return NextResponse.json(
        { error: 'Task ID is required for deletion' },
        {
          status: 400,
        },
      );
    }

    const sessionTokenCookie = await getCookie('sessionToken');

    if (!sessionTokenCookie) {
      console.log('User is not authenticated');
      return NextResponse.json(
        { error: 'User not authenticated' },
        {
          status: 401,
        },
      );
    }

    console.log('Attempting to delete task with ID:', taskId);
    const deleteResult = await deleteTask(sessionTokenCookie, taskId);

    if (deleteResult) {
      console.log('Task successfully deleted:', taskId);
      return NextResponse.json({ success: true });
    }

    console.log('Task not found or access denied');
    return NextResponse.json(
      { error: 'Task not found or access denied' },
      {
        status: 404,
      },
    );
  } catch (error) {
    console.error('Error in DELETE API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { taskId, checked } = body;

    if (typeof taskId !== 'number' || typeof checked !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const sessionToken = await getCookie('sessionToken');
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    const updatedTask = await updateTaskCheckedStatus(
      sessionToken,
      taskId,
      checked,
    );

    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
