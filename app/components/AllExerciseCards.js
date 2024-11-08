'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';
import { exercises } from '../database/fakeDB';
import styles from '../styles/AllExerciseCards.module.scss';

export default function ExerciseCard() {
  return (
    <div className={styles.exercisesContainer}>
      {exercises.map((exercise) => (
        <div key={`exercises-${exercise.id}`} className={styles.exerciseCard}>
          <div className={styles.nameContainer}>
            <span className={styles.infoIconWrapper}>
              <span className={styles.infoIcon}>i</span>
              <span className={styles.description}>{exercise.description}</span>
            </span>
            <h3 className={styles.exerciseName}>
              {exercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}
            </h3>
          </div>
          <DotLottieReact
            src={`/animations/${exercise.category}/${exercise.name}.lottie`}
            loop
            playOnHover
            width="150px"
          />
        </div>
      ))}
    </div>
  );
}
