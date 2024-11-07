'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';
import { exercises } from '../database/fakeDB';
import styles from '../styles/ExerciseCard.module.scss';
import ExerciseTimer from './ExerciseTimer';

export default function ExerciseCard({ breakType }) {
  // If no breakType is provided, show all exercises
  const filteredExercises = breakType
    ? exercises.filter((exercise) => exercise.category === breakType)
    : exercises; // Show all exercises if no breakType

  return (
    <div className={styles.exercisesContainer}>
      {filteredExercises.length > 0 ? (
        filteredExercises.map((exercise) => (
          <div key={`exercises-${exercise.id}`} className={styles.exerciseCard}>
            <h3 className={styles.exerciseName}>
              {exercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}
            </h3>
            <DotLottieReact
              src={`/animations/${exercise.category}/${exercise.name}.lottie`}
              loop
              autoplay
              width="150px"
            />
            <ExerciseTimer />
          </div>
        ))
      ) : (
        <p>Enjoy your break and don't forget to drink water!</p>
      )}
    </div>
  );
}
