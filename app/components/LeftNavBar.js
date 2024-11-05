'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from '../styles/LeftNavBar.module.scss';

export default function LeftNavBar() {
  const [isOpen, setIsOpen] = useState(false); // State for right sidebar visibility

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
        <Link href="/" className={styles.navLink}>
          Timer
        </Link>
        <Link href="/exercises" className={styles.navLink}>
          Exercises
        </Link>
        <Link href="/settings" className={styles.navLink}>
          Settings
        </Link>
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
          Timer
        </Link>
        <Link
          href="/exercises"
          className={styles.navLink}
          onClick={toggleSidebar}
        >
          Exercises
        </Link>
        <Link
          href="/settings"
          className={styles.navLink}
          onClick={toggleSidebar}
        >
          Settings
        </Link>
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
