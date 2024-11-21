import { NextResponse } from 'next/server';
import {
  type Task,
  taskSchema,
} from '../../../migrations/00004-createTableTasks';
import { getCookie } from '../../../util/cookies';
import {
  createTask,
  deleteTask,
  getTasks,
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

// Define the response body type for the GET request
type GetTasksResponseBody =
  | {
      tasks: {
        id: number;
        userId: number;
        textContent: string;
        checked: boolean;
      }[];
    }
  | { error: string };

export async function GET(): Promise<NextResponse<GetTasksResponseBody>> {
  try {
    // Get the session token from the cookie
    const sessionTokenCookie = await getCookie('sessionToken');

    if (!sessionTokenCookie) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    // Fetch tasks for the logged-in user
    const tasks = await getTasks(sessionTokenCookie);

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: 'No tasks found or access denied' },
        { status: 404 },
      );
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
): Promise<NextResponse<CreateTaskResponseBodyPost>> {
  const body = await request.json();

  // Validate tasks data with zod
  const result = taskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Request does not contain task object' },
      { status: 400 },
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
      { status: 400 },
    );
  }

  return NextResponse.json({ task: newTask });
}

export async function DELETE(
  request: Request,
): Promise<NextResponse<DeleteTaskResponseBodyDelete>> {
  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required for deletion' },
        { status: 400 },
      );
    }

    const sessionTokenCookie = await getCookie('sessionToken');

    if (!sessionTokenCookie) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    const deleteResult = await deleteTask(sessionTokenCookie, taskId);

    if (deleteResult) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Task not found or access denied' },
      { status: 404 },
    );
  } catch (error) {
    console.error('Error in DELETE API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
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
