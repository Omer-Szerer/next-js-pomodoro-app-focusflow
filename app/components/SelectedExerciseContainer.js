// SelectedExerciseContainer.js
'use server';
import { getExercisesInsecure } from '../database/exercises';
import SelectedExerciseCard from './SelectedExerciseCard';

export default async function SelectedExerciseContainer({ breakType }) {
  // Fetch all exercises from the database
  const exercises = await getExercisesInsecure();

  // Filter exercises based on breakType and select a random one
  const filteredExercises = breakType
    ? exercises.filter((exercise) => exercise.category === breakType)
    : exercises;

  const selectedExercise =
    filteredExercises.length > 0
      ? filteredExercises[Math.floor(Math.random() * filteredExercises.length)]
      : {
          id: 'default',
          name: "Enjoy your break, and don't forget to drink water!",
          category: 'General',
          description: '',
        };

  // Pass the selected exercise to SelectedExerciseCard as a prop
  return <SelectedExerciseCard exercise={selectedExercise} />;
}
