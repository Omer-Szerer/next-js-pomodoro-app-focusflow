'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import styles from '../styles/SelectedExerciseCard.module.scss';
import ExerciseTimer from './ExerciseTimer';

export default function SelectedExerciseCard({ exercise }) {
  const [isClient, setIsClient] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Local state for favorite

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  if (!exercise) return null;

  const isYouTube =
    exercise.visualization && exercise.visualization.includes('youtube.com');

  if (!isClient) {
    return null; // Prevent rendering client-only content during SSR
  }

  return (
    <div>
      <div
        key={`exercise-${exercise.id}`}
        className={`${styles.exerciseCard} ${
          exercise.id === 'default' ? styles.defaultExercise : ''
        }`}
      >
        {exercise.id === 'default' ? (
          <div className={styles.defaultMessage}>
            <h3>{exercise.name}</h3>
          </div>
        ) : (
          <>
            <div className={styles.nameContainer}>
              {/* Info icon and favorite button */}
              <span className={styles.infoIconWrapper}>
                <span className={styles.infoIcon}>i</span>
                <span className={styles.description}>
                  {exercise.description || 'No description available'}
                </span>
              </span>
              <h3 className={styles.exerciseName}>
                {exercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}
              </h3>
              <button
                className={`${styles.favoriteButton} ${
                  isFavorite ? styles.favorite : ''
                }`}
                onClick={toggleFavorite}
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
            <div className={styles.animationContainer}>
              {isYouTube ? (
                <ReactPlayer
                  url={exercise.visualization}
                  width="100%"
                  height="100%"
                  controls={true}
                />
              ) : (
                <DotLottieReact
                  src={`/animations/${exercise.category.toLowerCase()}/${exercise.name}.lottie`}
                  loop
                  autoplay
                  width="150px"
                />
              )}
            </div>
            <ExerciseTimer />
          </>
        )}
      </div>
    </div>
  );
}
