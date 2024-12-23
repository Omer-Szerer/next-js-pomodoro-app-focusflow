'use client';

import { Gugi } from 'next/font/google';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LoginForm from '../(auth)/login/LoginForm';
import LogoutButton from '../(auth)/logout/LogoutButton';
import RegisterForm from '../(auth)/register/RegisterForm';
import styles from '../styles/TopBar.module.scss';
import ProfileIcon from './ProfileIcon';

const gugi = Gugi({ weight: ['400'], subsets: ['latin'] });

// Props type
interface TopBarProps {
  sessionToken: string | null; // Session token might be null if the user is not logged in
  username: string | null; // Username might be null if the user is not logged in
}

export default function TopBar({ sessionToken, username }: TopBarProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Detect `modal=login` in query params
  useEffect(() => {
    if (searchParams.get('modal') === 'login') {
      setShowModal(true);
      setIsRegister(true);
    }
  }, [searchParams]);

  // Open the modal when "Sign In" button is clicked
  const handleSignInClick = () => {
    setShowModal(true);
    router.replace('?modal=login'); // Update URL without refreshing
  };

  // Close the modal and reset the form state
  const closeModal = () => {
    setShowModal(false);
    setIsRegister(true);
    router.replace('/'); // Remove query param
  };

  // Toggle the profile dropdown menu
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Redirect to the profile page
  const handleProfileClick = () => {
    router.push(`/profile/${username}`);
  };

  return (
    <nav className={styles.topBar}>
      <div className={styles.logo}>
        <div className={gugi.className}>FocusFlow</div>
      </div>
      {/* Show profile menu if user is logged in */}
      {sessionToken ? (
        <div className={styles.profileMenu}>
          <button className={styles.profileButton} onClick={toggleDropdown}>
            <ProfileIcon />
            {username || 'Profile'}
          </button>
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button
                className={styles.dropdownItem}
                onClick={handleProfileClick}
              >
                Profile
              </button>
              <LogoutButton
                className={styles.dropdownItem}
                username={username}
              />
            </div>
          )}
        </div>
      ) : (
        <button className={styles.profileButton} onClick={handleSignInClick}>
          <ProfileIcon />
          Sign In
        </button>
      )}

      {/* Overlay */}
      {showModal && (
        <div
          className={styles.loginOverlay}
          onClick={closeModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              closeModal();
            }
          }}
        />
      )}

      {/* Modal for Login/Register */}
      {showModal && (
        <div className={styles.modal}>
          <button onClick={closeModal} className={styles.closeButton}>
            ✖
          </button>
          {isRegister ? (
            <>
              <h2>Register</h2>
              <RegisterForm closeModal={closeModal} />
              <p>
                Already have an account?{' '}
                <button
                  className={styles.switchButton}
                  onClick={() => setIsRegister(false)}
                >
                  Log In
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Log In</h2>
              <LoginForm closeModal={closeModal} />
              <p>
                Don't have an account?{' '}
                <button
                  className={styles.switchButton}
                  onClick={() => setIsRegister(true)}
                >
                  Register
                </button>
              </p>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
