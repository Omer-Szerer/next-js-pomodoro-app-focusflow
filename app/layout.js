import './styles/globals.scss';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import LeftNavBar from './components/LeftNavBar';
import TopBar from './components/TopBar';
import { SessionProvider } from './contexts/SessionContext';
import { getValidSessionToken } from './database/sessions';
import { getUser } from './database/users';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const sessionTokenCookie = cookieStore.get('sessionToken');
  const sessionToken =
    sessionTokenCookie &&
    (await getValidSessionToken(sessionTokenCookie.value));

  // Fetch the user if a session exists
  const user = sessionToken ? await getUser(sessionTokenCookie.value) : null;

  // Truncate the username to 6 characters
  const truncatedUsername = user?.username
    ? user.username.slice(0, 6) // Limit to 6 characters
    : '';

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider sessionToken={!!sessionToken}>
          {children}
          {/* Pass the truncated username */}
          <TopBar sessionToken={!!sessionToken} username={truncatedUsername} />
          <LeftNavBar />
        </SessionProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
