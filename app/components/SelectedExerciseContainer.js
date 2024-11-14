import { useEffect, useState } from 'react';
import SelectedExerciseCard from './SelectedExerciseCard';

export default function SelectedExerciseContainer({ exercises, breakType }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    // Ensure exercises is an array
    const filteredExercises = Array.isArray(exercises)
      ? breakType
        ? exercises.filter((exercise) => exercise.category === breakType)
        : exercises // If no breakType is provided, use all exercises
      : [];

    // Choose a random exercise when the breakType changes or when exercises are provided
    if (filteredExercises.length > 0) {
      const randomExercise =
        filteredExercises[Math.floor(Math.random() * filteredExercises.length)];
      setSelectedExercise(randomExercise);
    } else {
      // Fallback to default message if no exercises match
      setSelectedExercise({
        id: 'default',
        name: "Enjoy your break, and don't forget to drink water!",
        category: 'General',
        description: '',
      });
    }
  }, [breakType, exercises]); // Re-run when breakType or exercises change

  return <SelectedExerciseCard exercise={selectedExercise} />;
}
