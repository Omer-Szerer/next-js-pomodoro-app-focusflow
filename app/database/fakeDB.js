// Fake Database

export const exercises = [
  {
    id: 1,
    name: 'Cobra-Pose',
    visualization: 'public/animations/stretch/Cobra-Stretch.lottie',
    description: 'dummy text',
    category: 'Stretch',
  },
  {
    id: 2,
    name: 'Jumping-Jacks',
    visualization: 'public/animations/physical/Jumping-Jacks.lottie',
    description: 'dummy text',
    category: 'Physical',
  },
  {
    id: 3,
    name: '4-7-8-Breathing-Exercise',
    visualization:
      'public/animations/breathing/4-7-8-Breathing-Exercise.lottie',
    description: 'dummy text',
    category: 'Breathing',
  },
  {
    id: 4,
    name: 'Downward-Dog-Stretch',
    visualization: 'public/animations/stretch/Downward-Dog-Stretch.lottie',
    description: 'dummy text',
    category: 'Stretch',
  },
  {
    id: 5,
    name: 'Bicycle-Crunches',
    visualization: 'public/animations/physical/Bicycle-Crunches.lottie',
    description: 'dummy text',
    category: 'Physical',
  },
  {
    id: 6,
    name: 'Standing-Side-Bends',
    visualization: 'public/animations/stretch/Standing-Side-Bends.lottie',
    description: 'dummy text',
    category: 'Stretch',
  },
  {
    id: 7,
    name: 'Push-Ups',
    visualization: 'public/animations/physical/Push-Ups.lottie',
    description: 'dummy text',
    category: 'Physical',
  },
  {
    id: 8,
    name: 'Box-Breathing',
    visualization: 'public/animations/breathing/Box-Breathing.lottie',
    description: 'dummy text',
    category: 'Breathing',
  },
];

export function getExercises() {
  return exercises;
}

export function getExercise(id) {
  return exercises.find((exercise) => exercise.id === id);
}
