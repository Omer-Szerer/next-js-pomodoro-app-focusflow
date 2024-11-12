// // real database file
import { cache } from 'react';
import { sql } from './connect';

type Exercise = {
  id: number;
  name: string;
  visualization: string;
  description: string;
  category: string;
};

export const getExercisesInsecure = cache(async () => {
  const exercises = await sql<Exercise[]>`
    SELECT
      id,
      name,
      visualization,
      description,
      category
    FROM
      exercises;
  `;
  return exercises;
});

export const getExerciseInsecure = cache(async (id: number) => {
  const [exercise] = await sql<Exercise[]>`
    SELECT
      id,
      name,
      visualization,
      description,
      category
    FROM
      exercises
    WHERE
      id = ${id};
  `;
  return exercise;
});
