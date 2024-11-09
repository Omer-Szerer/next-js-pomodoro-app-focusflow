'use client';
import { faGear, faSpa, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from '../styles/LeftNavBar.module.scss';

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
          <FontAwesomeIcon icon={faStopwatch} className={styles.iconSize} />
          <span>Timer</span>
        </Link>
        <Link href="/exercises" className={styles.navLink}>
          <FontAwesomeIcon icon={faSpa} className={styles.iconSize} />
          <span>Exercises</span>
        </Link>
        <Link href="/settings" className={styles.navLink}>
          <FontAwesomeIcon icon={faGear} className={styles.iconSize} />
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
          <FontAwesomeIcon icon={faStopwatch} className={styles.iconSize} />
          <span className={styles.navText}>Timer</span>
        </Link>
        <Link
          href="/exercises"
          className={styles.navLink}
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faSpa} className={styles.iconSize} />
          <span className={styles.navText}>Exercises</span>
        </Link>
        <Link
          href="/settings"
          className={styles.navLink}
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faGear} className={styles.iconSize} />
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
