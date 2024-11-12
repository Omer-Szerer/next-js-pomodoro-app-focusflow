// (Server Component)
import { getExercisesInsecure } from '../database/exercises';
import ExerciseCard from './ExerciseCard';

export default async function ExerciseList() {
  const exercises = await getExercisesInsecure(); // Fetch all exercises from the database

  return <ExerciseCard exercises={exercises} />;
}
