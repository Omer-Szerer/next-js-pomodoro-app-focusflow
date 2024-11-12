// // app/components/SelectedExerciseCardClient.tsx
// 'use client';

// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import { useEffect, useState } from 'react';
// import styles from '../styles/SelectedExerciseCard.module.scss';
// import ExerciseTimer from './ExerciseTimer';

// export default function SelectedExerciseCardClient({ exercises, breakType }) {
//   // State to hold the current exercise that will be displayed
//   const [randomExercise, setRandomExercise] = useState({
//     id: 'default',
//     name: "Enjoy your break, and don't forget to drink water!",
//     category: 'General',
//     description: '',
//   });

//   // useEffect hook to select an exercise based on the `breakType` prop when it changes
//   useEffect(() => {
//     const filteredExercises = breakType
//       ? exercises.filter((exercise) => exercise.category === breakType)
//       : exercises;

//     if (filteredExercises.length > 0) {
//       const selectedExercise =
//         filteredExercises[Math.floor(Math.random() * filteredExercises.length)];
//       setRandomExercise(selectedExercise);
//     } else {
//       setRandomExercise({
//         id: 'default',
//         name: "Enjoy your break, and don't forget to drink water!",
//         category: 'General',
//         description: '',
//       });
//     }
//   }, [breakType, exercises]); // Re-run when `breakType` or `exercises` changes

//   return (
//     <div>
//       <div
//         key={`exercise-${randomExercise.id}`}
//         className={styles.exerciseCard}
//       >
//         <div className={styles.nameContainer}>
//           <span className={styles.infoIconWrapper}>
//             <span className={styles.infoIcon}>i</span>
//             <span className={styles.description}>
//               {randomExercise.description || 'No description available'}
//             </span>
//           </span>
//           <h3 className={styles.exerciseName}>
//             {randomExercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}
//           </h3>
//         </div>

//         {randomExercise.id !== 'default' && (
//           <div className={styles.animationContainer}>
//             <DotLottieReact
//               src={`/animations/${randomExercise.category}/${randomExercise.name}.lottie`}
//               loop
//               autoplay
//               width="150px"
//             />
//           </div>
//         )}

//         {randomExercise.id !== 'default' && (
//           <div>
//             <ExerciseTimer />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
