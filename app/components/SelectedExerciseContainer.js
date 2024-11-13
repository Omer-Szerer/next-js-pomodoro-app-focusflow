// ---V1 (V2)--- //
'use server';
import { getExercisesInsecure } from '../database/exercises';
import SelectedExerciseCard from './SelectedExerciseCard';

// import Timers from './Timers';

export default async function SelectedExerciseContainer({ breakType }) {
  // Fetch all exercises from the database
  const exercises = await getExercisesInsecure();

  // Filter exercises based on the breakType, and select a random exercise from the filtered list
  const filteredExercises = breakType
    ? exercises.filter((exercise) => exercise.category === breakType)
    : exercises; // If no breakType is provided, use all exercises

  // Choose a random exercise from the filtered exercises or set a default message if none are available
  const selectedExercise =
    filteredExercises.length > 0
      ? filteredExercises[Math.floor(Math.random() * filteredExercises.length)]
      : {
          id: 'default',
          name: "Enjoy your break, and don't forget to drink water!",
          category: 'General',
          description: '',
        };

  // Render the selected exercise in the SelectedExerciseCard component
  return <SelectedExerciseCard exercise={selectedExercise} />;
}
