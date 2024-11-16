'use client';

import { useRouter } from 'next/navigation';
import { logout } from './actions';

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  return (
    <form>
      <button
        className={className}
        formAction={async () => {
          await logout();
          router.refresh();
        }}
      >
        Logout
      </button>
    </form>
  );
}
