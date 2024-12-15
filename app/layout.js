import './styles/globals.scss';
import { Nunito } from 'next/font/google';
import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import LeftNavBar from './components/LeftNavBar';
import TopBar from './components/TopBar';
import { SessionProvider } from './contexts/SessionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { getValidSessionToken } from './database/sessions';
import { getUser } from './database/users';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata = {
  title: 'FocusFlow |',
  description:
    'FocusFlow, a Pomodoro App that keeps your body and mind active!',
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const sessionTokenCookie = cookieStore.get('sessionToken');
  const sessionToken =
    sessionTokenCookie &&
    (await getValidSessionToken(sessionTokenCookie.value));

  const user = sessionToken ? await getUser(sessionTokenCookie.value) : null;
  const truncatedUsername = user?.username ? user.username.slice(0, 6) : '';

  return (
    <html lang="en">
      <body className={nunito.className}>
        <SessionProvider sessionToken={!!sessionToken}>
          <TopBar sessionToken={!!sessionToken} username={truncatedUsername} />
          <ThemeProvider>
            <LeftNavBar />

            <main>{children}</main>
          </ThemeProvider>
        </SessionProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{
            marginLeft: '145px',
          }}
        />
        <Footer />
      </body>
    </html>
  );
}
