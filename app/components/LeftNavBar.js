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
