import React from 'react';
import styles from '../styles/TopBar.module.scss';

export default function TopTab() {
  return (
    <nav className={styles.topBar}>
      <div href="/" className={styles.logo}>
        FocusFlow
      </div>
      <button className={styles.profileButton}>Sign in</button>
    </nav>
  );
}
