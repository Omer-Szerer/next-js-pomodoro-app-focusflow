import * as React from 'react';

const TimerIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="currentColor"
      d="M16.32 7.1A8 8 0 1 1 9 4.06V2h2v2.06c1.46.18 2.8.76 3.9 1.62l1.46-1.46 1.42 1.42-1.46 1.45zM10 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM7 0h6v2H7V0zm5.12 8.46 1.42 1.42L10 13.4 8.59 12l3.53-3.54z"
    />
  </svg>
);
export default TimerIcon;
