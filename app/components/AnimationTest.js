'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

export default function AnimationTest() {
  return (
    <div>
      <p>Here is the animation</p>
      <DotLottieReact
        src="/animations/physical/Jumping-Jacks.lottie"
        loop
        autoplay
      />
      <DotLottieReact
        src="/animations/physical/Squat-Jumps.lottie"
        loop
        autoplay
      />
    </div>
  );
}
