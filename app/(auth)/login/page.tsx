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
