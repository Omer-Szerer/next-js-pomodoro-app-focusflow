import { NextResponse } from 'next/server';
import {
  type Subtask,
  subtaskSchema,
} from '../../../migrations/00005-createTableSubtasks';
import { getCookie } from '../../../util/cookies';
import {
  createSubtask,
  deleteSubtask,
  getSubtasks,
  updateSubtaskCheckedStatus,
} from '../../database/subtasks';

async function checkAuthentication() {
  const sessionTokenCookie = await getCookie('sessionToken');
  if (!sessionTokenCookie) {
    return { error: 'User not authenticated', status: 401 };
  }
  return { sessionTokenCookie };
}

export type CreateSubtaskResponseBodyPost =
  | {
      subtask: { textContent: Subtask['textContent'] };
    }
  | {
      error: string;
    };

export type DeleteSubtaskResponseBodyDelete =
  | {
      success: boolean;
    }
  | {
      error: string;
    };

type GetSubtasksResponseBody =
  | {
      subtasks: {
        id: number;
        taskId: number;
        textContent: string;
        checked: boolean;
      }[];
    }
  | { error: string };

export async function GET(
  request: Request,
): Promise<NextResponse<GetSubtasksResponseBody>> {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = Number(searchParams.get('taskId'));

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 },
      );
    }

    const { sessionTokenCookie, error } = await checkAuthentication();
    if (error) return NextResponse.json({ error }, { status: 401 });

    if (!sessionTokenCookie) {
      return NextResponse.json(
        { error: 'No session token found' },
        { status: 401 },
      );
    }

    const subtasksRaw = await getSubtasks(sessionTokenCookie, taskId);

    // Ensure the types are correct and non-nullable
    const subtasks = subtasksRaw.map((subtask) => ({
      id: subtask.id,
      taskId: subtask.taskId,
      textContent: subtask.textContent,
      checked: subtask.checked,
    }));

    if (subtasks.length === 0) {
      return NextResponse.json(
        { error: 'No subtasks found or access denied' },
        { status: 404 },
      );
    }

    return NextResponse.json({ subtasks });
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
): Promise<NextResponse<CreateSubtaskResponseBodyPost>> {
  const body = await request.json();

  const result = subtaskSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Request does not contain a valid subtask object' },
      { status: 400 },
    );
  }

  const { taskId, text_content: textContent } = result.data;

  const { sessionTokenCookie, error } = await checkAuthentication();
  if (error) return NextResponse.json({ error }, { status: 401 });

  if (!sessionTokenCookie) {
    return NextResponse.json(
      { error: 'No session token found' },
      { status: 401 },
    );
  }

  const newSubtask = await createSubtask(
    sessionTokenCookie,
    taskId,
    textContent,
  );

  if (!newSubtask) {
    return NextResponse.json(
      { error: 'Subtask not created or access denied' },
      { status: 400 },
    );
  }

  return NextResponse.json({ subtask: newSubtask });
}

export async function DELETE(
  request: Request,
): Promise<NextResponse<DeleteSubtaskResponseBodyDelete>> {
  try {
    const body = await request.json();
    const { subtaskId } = body;

    if (!subtaskId) {
      return NextResponse.json(
        { error: 'Subtask ID is required for deletion' },
        { status: 400 },
      );
    }

    const { sessionTokenCookie, error } = await checkAuthentication();
    if (error) return NextResponse.json({ error }, { status: 401 });

    if (!sessionTokenCookie) {
      return NextResponse.json(
        { error: 'No session token found' },
        { status: 401 },
      );
    }

    // Ensure sessionTokenCookie is not undefined before calling deleteSubtask
    const deleteResult = await deleteSubtask(sessionTokenCookie, subtaskId);

    if (deleteResult) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Subtask not found or access denied' },
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { subtaskId, checked } = body;

    if (typeof subtaskId !== 'number' || typeof checked !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid subtask data' },
        { status: 400 },
      );
    }

    const { sessionTokenCookie, error } = await checkAuthentication();
    if (error) return NextResponse.json({ error }, { status: 401 });

    if (!sessionTokenCookie) {
      return NextResponse.json(
        { error: 'No session token found' },
        { status: 401 },
      );
    }

    const updatedSubtask = await updateSubtaskCheckedStatus(
      sessionTokenCookie,
      subtaskId,
      checked,
    );

    if (!updatedSubtask) {
      return NextResponse.json(
        { error: 'Failed to update subtask or access denied' },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating subtask:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
