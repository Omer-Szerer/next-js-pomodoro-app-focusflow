'use server';
import { getExercisesInsecure } from '../database/exercises';
import ExerciseCard from './ExerciseCard';

export default async function ExerciseList() {
  const exercises = await getExercisesInsecure();

  return <ExerciseCard exercises={exercises} />;
}
