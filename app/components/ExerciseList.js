// (Server Component)
import { getExercisesInsecure } from '../database/exercises';
import ExerciseCard from './ExerciseCard';

export default async function ExerciseList() {
  const exercises = await getExercisesInsecure(); // fetch exercises on the server
  console.log('Fetched exercises:', exercises); // Check data structure here

  return <ExerciseCard exercises={exercises} />;
}

// // (Server Component)
// import { getExercisesInsecure } from '../database/exercises';
// import SelectedExerciseCard from './SelectedExerciseCard';

// export default async function ExerciseList({ breakType }) {
//   // Fetch all exercises from the database using `getExercisesInsecure`
//   const exercises = await getExercisesInsecure();

//   // Pass all exercises to the client component along with breakType
//   return <SelectedExerciseCard exercises={exercises} breakType={breakType} />;
// }

// import React from 'react';
// import SelectedExerciseCard from './SelectedExerciseCard';

// export default function ExerciseList({ breakType }) {
//   const exercises = []; // Add logic to fetch exercises from your database
//   return (
//     <div>
//       <SelectedExerciseCard exercises={exercises} breakType={breakType} />
//     </div>
//   );
// }
