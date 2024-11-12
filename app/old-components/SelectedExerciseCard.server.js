// // app/components/SelectedExerciseCard.server.tsx
// import { getExercisesInsecure } from '../database/exercises';
// import SelectedExerciseCardClient from './SelectedExerciseCardClient';

// export default async function SelectedExerciseCard({ breakType }) {
//   // Fetch exercises from the database
//   const exercises = await getExercisesInsecure();

//   // Pass the fetched exercises to the Client Component
//   return (
//     <SelectedExerciseCardClient exercises={exercises} breakType={breakType} />
//   );
// }
