import { expect, test } from '@playwright/test';

test('navigation test', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Focus Time' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Short Break' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Long Break' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();

  await expect(page.getByPlaceholder('Add new task')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Add Task' })).toBeVisible();

  await expect(page.getByText('FocusFlow')).toBeVisible();

  await expect(
    page.locator('div').filter({ hasText: 'Timer' }).getByRole('link'),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Exercises' }).first().click();
  await page.waitForURL('/exercises');

  await expect(
    page.getByText('AllStretchPhysicalBreathingMeditation'),
  ).toBeVisible();

  const exercises = [
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
      name: '5-5-5-5 Box-Breathing',
      visualization: 'public/animations/breathing/5-5-5-5 Box-Breathing.lottie',
      description:
        'Box breathing is a breathing technique that can relieve stress and reset the mind and body after a stressful situation. The technique works by slowing down the breath and distracting the mind by drawing the focus to a 5-5-5-5 pattern of inhale, hold, exhale, hold.',
      category: 'Breathing',
    },
    {
      id: 9,
      name: 'Grounding-Exercise-for-Racing-Minds',
      visualization: 'https://www.youtube.com/watch?v=LgRd1Mzhb_Q',
      description:
        'Trying to tame our racing thoughts can feel like trying to tame a pack of wild horses. Learn how to gently bring your racing mind back to the present with self-compassion. ',
      category: 'Meditation',
    },
    {
      id: 10,
      name: 'Burpees',
      visualization: 'public/animations/physical/Burpees.lottie',
      description:
        'The burpee is a full-body, high-intensity bodyweight exercise that improve balance and coordination, and enhanced fat burning and weight loss.',
      category: 'Physical',
    },
    {
      id: 11,
      name: 'Chair-Squats',
      visualization: 'public/animations/physical/Chair-Squats.lottie',
      description:
        'Chair squats reduce the demand for balance and stability, making them suitable for beginners or those with mobility limitations. A modified version that target the same muscle groups as traditional squats, including the quadriceps, hamstrings, glutes, and core.',
      category: 'Physical',
    },
    {
      id: 12,
      name: 'Crunches',
      visualization: 'public/animations/physical/Crunches.lottie',
      description:
        'Crunches is an intense muscle isolation exercise that help build muscle. Unlike situps, they work only the abdominal muscles.',
      category: 'Physical',
    },
    {
      id: 13,
      name: 'Relaxing-4-Minute-Meditation-Music',
      visualization: 'https://www.youtube.com/watch?v=G2Jx5TuJEag',
      description:
        'This 4-minute meditation music is composed with gentle piano and ambient sounds, specially designed to calm your mind and reduce stress. Use this meditation music to aid in your mindfulness practices, sleep, and relaxation.',
      category: 'Meditation',
    },

    {
      id: 14,
      name: 'Flutter-Kicks',
      visualization: 'public/animations/physical/Flutter-Kicks.lottie',
      description:
        'Flutter kicks activate hip-flexor muscles, lower-back muscles, and quads, while targeting lower abdominal muscles. Can increase heart rate, promoting cardiovascular health',
      category: 'Physical',
    },
    {
      id: 15,
      name: 'Glute-Kick-Back',
      visualization: 'public/animations/physical/Glute-Kick-Back.lottie',
      description:
        'The glute kickback is an isolation exercise which works all three gluteal muscles (gluteus maximus, gluteus medius, and gluteus minimus). It also helps to strengthen your hamstrings, calves, and core,',
      category: 'Physical',
    },
    {
      id: 16,
      name: 'Hyperextension',
      visualization: 'public/animations/physical/Hyperextension.lottie',
      description:
        'Hyperextension strengthen lower back muscles, includes the erector spinae, which supports the lower spine.',
      category: 'Physical',
    },
    {
      id: 17,
      name: 'Knee-Push-Ups',
      visualization: 'public/animations/physical/Knee-Push-Ups.lottie',
      description:
        'Knee push-ups are a beginner-level bodyweight exercise that improve upper-body strength, and increase core stability.',
      category: 'Physical',
    },
    {
      id: 18,
      name: 'Leg-In-Outs',
      visualization: 'public/animations/physical/Leg-In-Outs.lottie',
      description:
        'Leg in outs is a pilates and warm-up exercise that primarily targets the abs and to a lesser degree also targets the glutes, hip flexors and quads.',
      category: 'Physical',
    },
    {
      id: 19,
      name: 'Lunges',
      visualization: 'public/animations/physical/Lunges.lottie',
      description:
        'Lunges are a resistance exercise that is popular for its ability to strengthen your back, hips, and legs, while improving mobility and stability. Lunges are ideal for those wishing to get stronger.',
      category: 'Physical',
    },
    {
      id: 20,
      name: '3-Minutes-Mindfulness-Meditation',
      visualization: 'https://www.youtube.com/watch?v=ABK0SYFxyEY',
      description:
        'A 3 minutes mindfulness meditation exercise to help with organize thoughts and emotions on a busy day.',
      category: 'Meditation',
    },

    {
      id: 21,
      name: 'Pistol-Box-Squat',
      visualization: 'public/animations/physical/Pistol-Box-Squat.lottie',
      description:
        'Pistol squats mainly work your quads, hamstrings, glutes, calves, and core. Isolation of each leg for balancing strength deficits.',
      category: 'Physical',
    },
    {
      id: 22,
      name: 'Plank-and-Reach',
      visualization: 'public/animations/physical/Plank-and-Reach.lottie',
      description:
        'The plank reach is an exercise targeting the entire core, particularly the oblique muscles. It resembles a plank exercise, but the primary difference is that the lifter extends their arms forward, one at time',
      category: 'Physical',
    },
    {
      id: 23,
      name: 'Bird-Dog',
      visualization: 'public/animations/stretch/Bird-Dog.lottie',
      description:
        'The Bird Dog active stretch strengthens the core, hips, and back muscles, helps relieve low back pain, and promotes proper posture.',
      category: 'Stretch',
    },
    {
      id: 24,
      name: 'Plie-Squat-Stretch',
      visualization: 'public/animations/stretch/Plie-Squat-Stretch.lottie',
      description:
        'Plie squats active stretch offer numerous benefits, including strengthened inner thighs and glutes, improved hip flexibility, and enhanced balance and stability.',
      category: 'Stretch',
    },
    {
      id: 25,
      name: 'Resting-Squat',
      visualization: 'public/animations/stretch/Resting-Squat.lottie',
      description:
        'Resting squats help elongate the lower back muscles, alleviating tension and reducing pain, maintaining hip mobility, and reducing aches and pains',
      category: 'Stretch',
    },
    {
      id: 26,
      name: 'Side-Lunge-Stretch',
      visualization: 'public/animations/stretch/Side-Lunge-Stretch.lottie',
      description:
        'Side lunges stretch the hips and groin, improve balance, and alleviate muscle imbalances.',
      category: 'Stretch',
    },
    {
      id: 27,
      name: 'Superman',
      visualization: 'public/animations/stretch/Superman.lottie',
      description:
        'Superman active stretch is designed to strengthen and improve stabilization of your lumbar and hip extensors, helps provide spinal support,and reduces the risk of back injury.',
      category: 'Stretch',
    },
    {
      id: 28,
      name: 'Side-Kick-Bent-Knee',
      visualization: 'public/animations/stretch/Side-Kick-Bent-Knee.lottie',
      description:
        'Side Kick Bent Knee is an active stretch exercise useful for shaping and toning the gluteus muscles while simultaneously working the hip flexor muscles, inner thighs and the lower back.',
      category: 'Stretch',
    },
    {
      id: 29,
      name: 'Squat-Jumps',
      visualization: 'public/animations/physical/Squat-Jumps.lottie',
      description:
        'Jump squats work the glutes, hamstrings, quadriceps, and lower back. They increase your explosive strength and build the muscles supporting the hip and knee, reducing your risk of injury and pain in those areas.',
      category: 'Physical',
    },
    {
      id: 30,
      name: 'Tiger-Bend-Push-Ups',
      visualization: 'public/animations/physical/Tiger-Bend-Push-Ups.lottie',
      description:
        'Tiger bend push ups help you work on your triceps, deltoids and trapezius. There seem to be different versions of this kind of push ups.',
      category: 'Physical',
    },
    {
      id: 31,
      name: '4-4-4-4 Box-Breathing',
      visualization: 'public/animations/physical/4-4-4-4 Box-Breathing.lottie',
      description:
        'Box breathing is a breathing technique that can relieve stress and reset the mind and body after a stressful situation. The technique works by slowing down the breath and distracting the mind by drawing the focus to a 4-4-4-4 pattern of inhale, hold, exhale, hold.',
      category: 'Breathing',
    },
    {
      id: 32,
      name: '1-Minute-Guided-Meditation',
      visualization: 'https://www.youtube.com/watch?v=F7PxEy5IyV4',
      description:
        'A short guided meditation exercise to help with relaxation.',
      category: 'Meditation',
    },
    {
      id: 33,
      name: 'Mountain-Climber',
      visualization: 'public/animations/physical/Mountain-Climber.lottie',
      description:
        "Mountain climbers are great for building cardio endurance, core strength, and agility. You work several muscle groups with mountain climbers—it's almost like getting a total-body workout with just one exercise.",
      category: 'Physical',
    },
    {
      id: 34,
      name: 'Box-Push-Ups',
      visualization: 'public/animations/physical/Box-Push-Ups.lottie',
      description:
        'An easier variation, Box Push-ups offer many health benefits like building upper body strength, and protecting shoulders and lower back from injuries.',
      category: 'Physical',
    },
    {
      id: 35,
      name: 'Dead-Bug',
      visualization: 'public/animations/physical/Dead-Bug.lottie',
      description:
        'The Dead Bug exercise helps improving pelvic stability, activating deep abdominal muscles, and help you learn how to differentiate the movement between your hips, pelvis and lower spine.',
      category: 'Physical',
    },
  ];

  for (const exercise of exercises) {
    await expect(page.getByTestId(`exercise-name-${exercise.name}`)).toHaveText(
      exercise.name.replace(/(?<=[a-zA-Z])-|-(?=[a-zA-Z])/g, ' '),
    );
  }

  // await page.getByRole('link', { name: 'Settings' }).first().click();
  // await page.waitForURL('/settings');
});
