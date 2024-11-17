'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from '../styles/LeftNavBar.module.scss';
import ExercisesIcon from './ExercisesIcon';
import SettingsIcon from './SettingsIcon';
import TimerIcon from './TimerIcon';

export default function LeftNavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Hamburger Icon for small screens */}
      <button
        className={styles.hamburgerIcon}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Left Sidebar Navigation (Always visible on large screens) */}
      <nav className={styles.navContainer}>
        <Link href="/" className={styles.navLinkTimer}>
          <TimerIcon />

          <span>Timer</span>
        </Link>
        <Link href="/exercises" className={styles.navLink}>
          <ExercisesIcon />

          <span>Exercises</span>
        </Link>
        <Link href="/settings" className={styles.navLink}>
          <SettingsIcon />
          <span>Settings</span>
        </Link>

        {/* LIGHT/DARK MODE SWITCHER TBD */}
        {/* <div className={styles.navModeSwitcher}>
          <FontAwesomeIcon icon={faSun} className={styles.iconSize} />
          <span>Light mode</span>
        </div> */}
      </nav>

      {/* Right Sidebar Navigation for small screens */}
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
        <Link href="/" className={styles.navLink} onClick={toggleSidebar}>
          <TimerIcon />
          <span className={styles.navText}>Timer</span>
        </Link>
        <Link
          href="/exercises"
          className={styles.navLink}
          onClick={toggleSidebar}
        >
          <ExercisesIcon />
          <span className={styles.navText}>Exercises</span>
        </Link>
        <Link
          href="/settings"
          className={styles.navLink}
          onClick={toggleSidebar}
        >
          <SettingsIcon />
          <span className={styles.navText}>Settings</span>
        </Link>

        {/* LIGHT/DARK MODE SWITCHER TBD */}
        {/* <div className={styles.navModeSwitcher}>
          <FontAwesomeIcon icon={faSun} className={styles.iconSize} />
          <span className={styles.navText}>Light mode</span>
        </div> */}
      </nav>

      {/* Overlay for mobile view when sidebar is open */}
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
