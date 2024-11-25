'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import styles from '../styles/AllExerciseCards.module.scss';

export default function ExerciseCard({ exercises }) {
  const [isClient, setIsClient] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) => {
      if (category === 'All') return ['All'];

      const updatedCategories = prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories.filter((cat) => cat !== 'All'), category];

      return updatedCategories.length === 0 ? ['All'] : updatedCategories;
    });
  };

  const handleFavoriteToggle = (exerciseId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = new Set(prevFavorites);
      if (updatedFavorites.has(exerciseId)) {
        updatedFavorites.delete(exerciseId);
      } else {
        updatedFavorites.add(exerciseId);
      }
      return updatedFavorites;
    });
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      selectedCategories.includes('All') ||
      selectedCategories.includes(exercise.category),
  );

  return (
    <div>
      {/* Category Filter Rendering */}
      <div className={styles.filterContainer}>
        {['All', 'Stretch', 'Physical', 'Breathing', 'Meditation'].map(
          (category) => (
            <label
              key={`category-${category}`}
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

      {/*  Exercise Cards Rendering */}
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
              {/* Favorite Icon */}
              <button
                className={`${styles.favoriteButton} ${
                  favorites.has(exercise.id) ? styles.favorite : ''
                }`}
                onClick={() => handleFavoriteToggle(exercise.id)}
                aria-label={
                  favorites.has(exercise.id)
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
              >
                {favorites.has(exercise.id) ? '❤️' : '🤍'}
                {/* {favorites.has(exercise.id) ? '⭐️' : '☆'} */}
              </button>
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
