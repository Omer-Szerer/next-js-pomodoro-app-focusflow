'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import styles from '../styles/SelectedExerciseCard.module.scss';
import ExerciseTimer from './ExerciseTimer';

export default function SelectedExerciseCard({ exercise }) {
  const [isClient, setIsClient] = useState(false);

  // Set the component to render only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure exercise is not null or undefined before accessing properties
  if (!exercise) return null;

  // Check if the visualization is a YouTube link
  const isYouTube =
    exercise.visualization && exercise.visualization.includes('youtube.com');

  if (!isClient) {
    return null; // Prevent rendering client-only content during SSR
  }

  return (
    <div>
      <div key={`exercise-${exercise.id}`} className={styles.exerciseCard}>
        <div className={styles.nameContainer}>
          <span className={styles.infoIconWrapper}>
            <span className={styles.infoIcon}>i</span>
            <span className={styles.description}>
              {exercise.description || 'No description available'}
            </span>
          </span>
          <h3 className={styles.exerciseName}>
            {exercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}
          </h3>
        </div>
        {exercise.id !== 'default' && (
          <div className={styles.animationContainer}>
            {/* Conditional Rendering: YouTube or Lottie */}
            {isYouTube ? (
              <ReactPlayer
                url={exercise.visualization}
                width="100%"
                height="100%"
                controls={true}
              />
            ) : (
              <DotLottieReact
                src={`/animations/${exercise.category}/${exercise.name}.lottie`}
                loop
                autoplay
                width="150px"
              />
            )}
          </div>
        )}
        {exercise.id !== 'default' && <ExerciseTimer />}
      </div>
    </div>
  );
}
