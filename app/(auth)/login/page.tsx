// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import React from 'react';
// import { getSafeReturnToPath } from '../../../util/validation';
// import { getValidSessionToken } from '../../database/sessions';
// import LoginForm from './LoginForm';

// type Props = {
//   searchParams: Promise<{
//     returnTo?: string | string[];
//   }>;
// };

// export default async function LoginPage(props: Props) {
//   const { returnTo } = await props.searchParams;
//   // Task: Add redirect to home if user is logged in

//   // 1. Check if the sessionToken cookie exists
//   const sessionTokenCookie = (await cookies()).get('sessionToken');

//   // 2. Check if the sessionToken cookie is still valid
//   const session =
//     sessionTokenCookie &&
//     (await getValidSessionToken(sessionTokenCookie.value));

//   // 3. If the sessionToken cookie is valid, redirect to home
//   if (session) {
//     redirect(getSafeReturnToPath(returnTo) || '/');
//   }

//   // 4. If the sessionToken cookie is invalid or doesn't exist, show the login form
//   return (
//     <div>
//       <LoginForm returnTo={returnTo} />
//     </div>
//   );
// }

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSafeReturnToPath } from '../../../util/validation';
import { getValidSessionToken } from '../../database/sessions';

type Props = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

export default async function LoginPage(props: Props) {
  const { returnTo } = await props.searchParams;

  // Check if the sessionToken cookie exists
  const sessionTokenCookie = (await cookies()).get('sessionToken');

  // Check if the sessionToken cookie is still valid
  const session =
    sessionTokenCookie &&
    (await getValidSessionToken(sessionTokenCookie.value));

  if (session) {
    // If session is valid, redirect to home or returnTo
    redirect(getSafeReturnToPath(returnTo) || '/');
  } else {
    // If session is invalid or doesn't exist, redirect to home with modal open
    redirect(`/?modal=login`);
  }
}
