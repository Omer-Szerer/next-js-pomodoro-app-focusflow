import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  type User,
  userSchema,
} from '../../../../migrations/00002-createTableUsers';
import { secureCookieOptions } from '../../../../util/cookies';
import { createSessionInsecure } from '../../../database/sessions';
import { createUserInsecure, getUserInsecure } from '../../../database/users';

export type RegisterResponseBody =
  | {
      user: User;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: Request,
): Promise<NextResponse<RegisterResponseBody>> {
  // Task: Implement the user registration workflow

  // 1. Get the user data from the request
  const requestBody = await request.json();

  // 2. Validate the user data with zod
  const result = userSchema.safeParse(requestBody);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => {
      if (issue.code === 'too_small') {
        return {
          message: `${issue.path[0]} is too short.
          Minimum length is ${issue.minimum}.`,
        };
      }
      if (issue.code === 'too_big') {
        return {
          message: `${issue.path[0]} is too long.
          Maximum length is ${issue.maximum}.`,
        };
      }
      return { message: issue.message }; // Default to Zod's message
    });

    return NextResponse.json(
      { errors: formattedErrors },
      {
        status: 400,
      },
    );
  }
  // if (!result.success) {
  //   return NextResponse.json(
  //     { errors: result.error.issues },
  //     {
  //       status: 400,
  //     },
  //   );
  // }

  // 3. Check if user already exist in the database
  const user = await getUserInsecure(result.data.username);

  if (user) {
    return NextResponse.json(
      {
        errors: [
          {
            message: 'Username already taken',
          },
        ],
      },
      {
        status: 400,
      },
    );
  }

  // This is where you do confirm password

  // 4. Hash the plain password from the user
  const passwordHash = await bcrypt.hash(result.data.password, 12);

  // 5. Save the user information with the hashed password in the database
  const newUser = await createUserInsecure(
    result.data.username,
    result.data.email,
    passwordHash,
  );

  if (!newUser) {
    return NextResponse.json(
      {
        errors: [
          {
            message: 'Registration failed',
          },
        ],
      },
      {
        status: 400,
      },
    );
  }

  // 6. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // 7. Create the session record
  const session = await createSessionInsecure(newUser.id, token);

  if (!session) {
    return NextResponse.json(
      {
        errors: [
          {
            message: 'Problem creating session',
          },
        ],
      },
      {
        status: 400,
      },
    );
  }

  // 8. Send the new cookie in the headers
  // (await cookies()).set({
  //   name: 'sessionToken',
  //   value: session.token,
  //   httpOnly: true,
  //   path: '/',
  //   sameSite: 'lax',
  //   secure: process.env.NODE_ENV === 'production',
  //   maxAge: 60 * 60 * 24, // This expires in 24 hours
  // });

  (await cookies()).set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  // 9. Return the new user information
  return NextResponse.json({ user: newUser });
  // return NextResponse.json({ user: 'newUser' });
}
