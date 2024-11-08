// Fake Database

export const exercises = [
  {
    id: 1,
    name: 'Cobra-Pose',
    visualization: 'public/animations/stretch/Cobra-Stretch.lottie',
    description:
      'Cobra pose increases spine mobility, strengthens spinal support muscles, and can help relieve back pain.',
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
  {
    id: 9,
    name: 'Guided-Meditation',
    visualization: 'https://www.youtube.com/watch?v=F7PxEy5IyV4',
    description: 'A guided meditation exercise to help with relaxation.',
    category: 'Meditation',
  },
  {
    id: 10,
    name: 'Abstract-Meditation',
    visualization: 'public/animations/meditation/Abstract-Meditation.lottie',
    description: 'A meditation exercise to help with relaxation.',
    category: 'Meditation',
  },
];

export function getExercises() {
  return exercises;
}

export function getExercise(id) {
  return exercises.find((exercise) => exercise.id === id);
}
