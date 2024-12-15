import { useContext } from 'react';
import { themeContext } from '../contexts/ThemeContext';
import styles from '../styles/ThemeToggle.module.scss';
import MoonIcon from './MoonIcon';
import SunIcon from './SunIcon';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(themeContext);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleTheme();
    }
  };

  return (
    <div
      className={`${styles.navModeSwitcher} ${styles.iconSpacing}`}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <div className={styles.navLink}>
          <MoonIcon className={styles.iconSize} />
          <span>Dark Mode</span>
        </div>
      ) : (
        <div className={styles.navLink}>
          <SunIcon className={styles.iconSize} />
          <span>Light Mode</span>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
