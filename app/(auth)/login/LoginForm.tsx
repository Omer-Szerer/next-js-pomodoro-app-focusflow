'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getSafeReturnToPath } from '../../../util/validation';
import styles from '../../styles/RegisterForm.module.scss';
import type { LoginResponseBody } from '../api/login/route';

type Props = {
  returnTo?: string | string[];
  closeModal?: () => void;
};

export default function LoginForm({ returnTo, closeModal = () => {} }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('api/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data: LoginResponseBody = await response.json();

    if ('errors' in data) {
      data.errors.forEach((error) => {
        toast.error(error.message); // Show errors as toast notifications
      });
      return;
    }

    toast.success(`Welcome back, ${username}!`);

    // After successful login, close the modal and redirect
    closeModal();
    router.push(getSafeReturnToPath(returnTo) || '/');

    router.refresh();
  }

  return (
    <>
      <div className={styles.inputFields}>
        <form onSubmit={async (event) => await handleLogin(event)}>
          <label>
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
          </label>

          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          </label>

          <button className={styles.submitButton}>Login</button>
        </form>
      </div>
      <div className={styles.animationContainer}>
        <DotLottieReact
          src="/animations/physical/Bicycle-Crunches.lottie"
          loop
          autoplay
        />
      </div>
    </>
  );
}
