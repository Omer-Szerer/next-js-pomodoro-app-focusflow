'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import styles from '../styles/LeftNavBar.module.scss';
import ExercisesIcon from './ExercisesIcon';
import SettingsIcon from './SettingsIcon';
import TimerIcon from './TimerIcon';

export default function LeftNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const getLinkClass = (href) =>
    `${styles.navLink} ${pathname === href ? styles.activeLink : ''}`;

  return (
    <>
      <button
        className={styles.hamburgerIcon}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <nav className={styles.navContainer}>
        <div className={styles.navLinkTimer}>
          <Link href="/" className={getLinkClass('/')}>
            <TimerIcon />
            <span>Timer</span>
          </Link>
        </div>
        <Link href="/exercises" className={getLinkClass('/exercises')}>
          <ExercisesIcon />
          <span>Exercises</span>
        </Link>
        <Link href="/settings" className={getLinkClass('/settings')}>
          <SettingsIcon />
          <span>Settings</span>
        </Link>
      </nav>

      <nav
        className={`${styles.rightNavContainer} ${isOpen ? styles.open : ''}`}
      >
        <button
          className={styles.closeIcon}
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          ✖
        </button>
        <Link href="/" className={getLinkClass('/')} onClick={toggleSidebar}>
          <TimerIcon />
          <span className={styles.navText}>Timer</span>
        </Link>
        <Link
          href="/exercises"
          className={getLinkClass('/exercises')}
          onClick={toggleSidebar}
        >
          <ExercisesIcon />
          <span className={styles.navText}>Exercises</span>
        </Link>
        <Link
          href="/settings"
          className={getLinkClass('/settings')}
          onClick={toggleSidebar}
        >
          <SettingsIcon />
          <span className={styles.navText}>Settings</span>
        </Link>
      </nav>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={toggleSidebar}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') && toggleSidebar()
          }
          role="button"
          tabIndex={0}
          aria-label="Close overlay"
        />
      )}
    </>
  );
}
