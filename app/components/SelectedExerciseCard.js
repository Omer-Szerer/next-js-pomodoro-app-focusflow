import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useEffect, useState } from 'react';
import { exercises } from '../database/fakeDB';
import styles from '../styles/SelectedExerciseCard.module.scss';
import ExerciseTimer from './ExerciseTimer';

export default function ExerciseCard({ breakType }) {
  // State to hold the current exercise that will be displayed
  const [randomExercise, setRandomExercise] = useState({
    id: 'default',
    name: "Enjoy your break, and don't forget to drink water!", // Default message if no exercise is selected
    category: 'General',
    description: '', // Default empty description
  });

  // useEffect hook to select an exercise based on the `breakType` prop when it changes
  useEffect(() => {
    // Filter exercises based on the category provided by `breakType`
    const filteredExercises = breakType
      ? exercises.filter((exercise) => exercise.category === breakType) // If breakType exists, filter exercises by category
      : exercises; // If no breakType, use all exercises

    // If there are exercises after filtering, randomly select one and set it in state
    if (filteredExercises.length > 0) {
      const selectedExercise =
        filteredExercises[Math.floor(Math.random() * filteredExercises.length)];
      setRandomExercise(selectedExercise); // Update state with the selected exercise
    } else {
      // If no exercises match the filter, set default exercise
      setRandomExercise({
        id: 'default',
        name: "Enjoy your break, and don't forget to drink water!", // Default message
        category: 'General',
        description: '', // Default empty description
      });
    }
  }, [breakType]); // The hook will run again whenever `breakType` changes

  return (
    <div>
      <div
        key={`exercise-${randomExercise.id}`} // Unique key for the exercise card
        className={styles.exerciseCard} // Applying the styling for the exercise card
      >
        {/* Exercise name and description section */}
        <div className={styles.nameContainer}>
          <span className={styles.infoIconWrapper}>
            {/* Info icon and description text */}
            <span className={styles.infoIcon}>i</span>
            <span className={styles.description}>
              {randomExercise.description || 'No description available'}{' '}
              {/* Display the description or a default message */}
            </span>
          </span>
          {/* Exercise name with formatted text */}
          <h3 className={styles.exerciseName}>
            {randomExercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}{' '}
            {/* Replaces hyphens with spaces in the name */}
          </h3>
        </div>

        {/* Check if the exercise is not the default and display the animation */}
        {randomExercise.id !== 'default' && (
          <div className={styles.animationContainer}>
            {/* Display a Lottie animation for the exercise, sourced from the category and name */}
            <DotLottieReact
              src={`/animations/${randomExercise.category}/${randomExercise.name}.lottie`} // Path to the Lottie animation file
              loop // Set the animation to loop
              autoplay // Set the animation to autoplay
              width="150px" // Set the width of the animation
            />
          </div>
        )}

        {/* Display the ExerciseTimer component if the exercise is not the default */}
        {randomExercise.id !== 'default' && (
          <div>
            <ExerciseTimer /> {/* Display the timer for the exercise */}
          </div>
        )}
      </div>
    </div>
  );
}
