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
    description:
      'Jumping jacks improve aerobic capacity, decrease resting heart rate and blood pressure, decrease risk of cardiovascular disease, and improve metabolism.',
    category: 'Physical',
  },
  {
    id: 3,
    name: '4-7-8-Breathing-Exercise',
    visualization:
      'public/animations/breathing/4-7-8-Breathing-Exercise.lottie',
    description:
      'The 4-7-8 breathing technique helps to decrease anxiety, sleep better, manage food cravings and control emotional responses like anger.',
    category: 'Breathing',
  },
  {
    id: 4,
    name: 'Downward-Dog-Stretch',
    visualization: 'public/animations/stretch/Downward-Dog-Stretch.lottie',
    description:
      'The Downward dog stretch helps strengthen the upper body, opens up the backs of the legs, elongates the spine, improve circulation, relieves tension and stress.',
    category: 'Stretch',
  },
  {
    id: 5,
    name: 'Bicycle-Crunches',
    visualization: 'public/animations/physical/Bicycle-Crunches.lottie',
    description:
      'Bicycle crunches improve stability, flexibility and coordination along with toning and strengthening your midsection.',
    category: 'Physical',
  },
  {
    id: 6,
    name: 'Standing-Side-Bends',
    visualization: 'public/animations/stretch/Standing-Side-Bends.lottie',
    description:
      'Side bends bring balance to your entire body. They lengthen the abdominal muscles, hips, and thigh muscles, while improving flexibility in the spine. ',
    category: 'Stretch',
  },
  {
    id: 7,
    name: 'Push-Ups',
    visualization: 'public/animations/physical/Push-Ups.lottie',
    description:
      'Push-ups offer many health benefits like building upper body strength, improving balance and posture, and protecting shoulders and lower back from injuries.',
    category: 'Physical',
  },
  {
    id: 8,
    name: 'Box-Breathing',
    visualization: 'public/animations/breathing/Box-Breathing.lottie',
    description:
      'Box breathing is a deep breathing technique that can help slow down your breathing, calming the nervous system, and decreasing stress in your body.',
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
