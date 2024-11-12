// (Server Component)

import { getExercisesInsecure } from '../database/exercises';
import ExerciseCard from './ExerciseCard';

export default async function ExerciseList() {
  const exercises = await getExercisesInsecure(); // fetch exercises on the server
  console.log('Fetched exercises:', exercises); // Check data structure here

  return <ExerciseCard exercises={exercises} />;
}
