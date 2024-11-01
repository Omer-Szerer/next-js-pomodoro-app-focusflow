import Link from 'next/link';
import React from 'react';

export default function LeftNavBar() {
  return (
    <nav>
      <Link href="/">Timer</Link>
      <Link href="/exercises">Exercises</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}

// import Link from 'next/link';
// import React from 'react';

// // Inline styles
// const navStyles = {
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'flex-start',
//   alignItems: 'flex-start',
//   height: '100vh', // Full height for sidebar
//   padding: '20px',
//   borderRight: '1px solid #ccc', // Thin line separator
//   width: '200px', // Adjust width as desired
//   position: 'fixed', // Make it stay on the left side
// };

// const linkStyles = {
//   marginBottom: '20px',
//   color: '#333',
//   textDecoration: 'none',
// };

// export default function LeftNavBar() {
//   return (
//     <nav style={navStyles}>
//       <Link href="/" style={linkStyles}>
//         Timer
//       </Link>
//       <Link href="/exercises" style={linkStyles}>
//         Exercises
//       </Link>
//       <Link href="/settings" style={linkStyles}>
//         Settings
//       </Link>
//     </nav>
//   );
// }
