// WITHOUT REACT-PLAYER KEEP THIS VERSION JUST IN CASE!!
// 'use client';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import React from 'react';
// import { exercises } from '../database/fakeDB';
// import styles from '../styles/AllExerciseCards.module.scss';

// export default function ExerciseCard() {
//   return (
//     <div className={styles.exercisesContainer}>
//       {exercises.map((exercise) => (
//         <div key={`exercises-${exercise.id}`} className={styles.exerciseCard}>
//           <div className={styles.nameContainer}>
//             <span className={styles.infoIconWrapper}>
//               <span className={styles.infoIcon}>i</span>
//               <span className={styles.description}>{exercise.description}</span>
//             </span>
//             <h3 className={styles.exerciseName}>
//               {exercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}
//             </h3>
//           </div>
//           <DotLottieReact
//             src={`/animations/${exercise.category}/${exercise.name}.lottie`}
//             loop
//             playOnHover
//             width="150px"
//           />
//         </div>
//       ))}
//     </div>
//   );
// }

// 'use client';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import React, { useEffect, useState } from 'react';
// import ReactPlayer from 'react-player/youtube';
// import { exercises } from '../database/fakeDB';
// import styles from '../styles/AllExerciseCards.module.scss';

// export default function ExerciseCard() {
//   // State to manage whether the component is running on the client
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     // Set isClient to true once the component is mounted on the client
//     setIsClient(true);
//   }, []);

//   return (
//     <div className={styles.exercisesContainer}>
//       {exercises.map((exercise) => (
//         <div key={`exercises-${exercise.id}`} className={styles.exerciseCard}>
//           <div className={styles.nameContainer}>
//             <span className={styles.infoIconWrapper}>
//               <span className={styles.infoIcon}>i</span>
//               <span className={styles.description}>{exercise.description}</span>
//             </span>
//             <h3 className={styles.exerciseName}>
//               {exercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}
//             </h3>
//           </div>

//           {/* Render the visualization */}
//           {isClient && exercise.visualization && (
//             <div className={styles.visualizationContainer}>
//               {/* If visualization is a YouTube link, use ReactPlayer */}
//               {exercise.visualization.includes('youtube.com') && (
//                 <ReactPlayer
//                   url={exercise.visualization}
//                   width="100%"
//                   height="330px"
//                   controls={true}
//                 />
//               )}
//               {/* Otherwise, render other types of visualizations */}
//               {!exercise.visualization.includes('youtube.com') && (
//                 <DotLottieReact
//                   src={`/animations/${exercise.category}/${exercise.name}.lottie`}
//                   loop
//                   playOnHover
//                   width="150px"
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { exercises } from '../database/fakeDB';
import styles from '../styles/AllExerciseCards.module.scss';

export default function ExerciseCard() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['All']);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) => {
      if (category === 'All') return ['All'];

      // Toggle category selection
      const updatedCategories = prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories.filter((cat) => cat !== 'All'), category];

      // If no categories are selected, default to "All"
      return updatedCategories.length === 0 ? ['All'] : updatedCategories;
    });
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      selectedCategories.includes('All') ||
      selectedCategories.includes(exercise.category),
  );

  return (
    <div>
      <div className={styles.filterContainer}>
        {['All', 'Stretch', 'Physical', 'Breathing', 'Meditation'].map(
          (category) => (
            <label
              key={`category-${category.id}`}
              className={styles.checkboxLabel}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ),
        )}
      </div>

      <div className={styles.exercisesContainer}>
        {filteredExercises.map((exercise) => (
          <div key={`exercises-${exercise.id}`} className={styles.exerciseCard}>
            <div className={styles.nameContainer}>
              <span className={styles.infoIconWrapper}>
                <span className={styles.infoIcon}>i</span>
                <span className={styles.description}>
                  {exercise.description}
                </span>
              </span>
              <h3 className={styles.exerciseName}>
                {exercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' ')}
              </h3>
            </div>

            {isClient && exercise.visualization && (
              <div className={styles.visualizationContainer}>
                {exercise.visualization.includes('youtube.com') ? (
                  <ReactPlayer
                    url={exercise.visualization}
                    width="100%"
                    height="330px"
                    controls={true}
                  />
                ) : (
                  <DotLottieReact
                    src={`/animations/${exercise.category}/${exercise.name}.lottie`}
                    loop
                    playOnHover
                    width="150px"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
