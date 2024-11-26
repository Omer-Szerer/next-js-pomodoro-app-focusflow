'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../styles/Timer.module.scss';
import SelectedExerciseContainer from './SelectedExerciseContainer';
import StartPauseButton from './StartPauseButton';

const FOCUS_TIME = 60 * 25;
const SHORT_BREAK = 60 * 5;
const LONG_BREAK = 60 * 20;

export default function Timers({ exercises }) {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('Focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [breakChoice, setBreakChoice] = useState('');
  const [hasChosenBreak, setHasChosenBreak] = useState(false);

  // Memoize selected exercise so it doesn't change unnecessarily
  const selectedExercise = useMemo(() => {
    if (!breakChoice) return null;
    const filteredExercises = exercises.filter(
      (exercise) => exercise.category === breakChoice,
    );
    return filteredExercises.length > 0
      ? filteredExercises[Math.floor(Math.random() * filteredExercises.length)]
      : {
          id: 'default',
          name: "Enjoy your break, and don't forget to drink water!",
          category: 'General',
          description: '',
        };
  }, [breakChoice, exercises]);

  const switchToSession = (session) => {
    setIsRunning(false);
    setBreakChoice('');
    localStorage.removeItem('timeLeft'); // Clear localStorage to avoid conflicts

    if (session === 'Focus') {
      setSessionType('Focus');
      setTimeLeft(FOCUS_TIME); // Always use updated constant
    } else if (session === 'Short Break') {
      setSessionType('Short Break');
      setTimeLeft(SHORT_BREAK); // Always use updated constant
    } else {
      setSessionType('Long Break');
      setTimeLeft(LONG_BREAK); // Always use updated constant
    }
  };

  const handleSessionSwitch = useCallback(() => {
    setBreakChoice('');
    if (sessionType === 'Focus') {
      setSessionCount((prevCount) => (prevCount + 1) % 4);
      if (sessionCount === 3) {
        setSessionType('Long Break');
        setTimeLeft(LONG_BREAK); // Updated LONG_BREAK
      } else {
        setSessionType('Short Break');
        setTimeLeft(SHORT_BREAK); // Updated SHORT_BREAK
      }
    } else {
      setSessionType('Focus');
      setTimeLeft(FOCUS_TIME); // Updated FOCUS_TIME
    }
    setIsRunning(false);
  }, [sessionType, sessionCount]);

  const playSound = async () => {
    try {
      const audio = new Audio('/sounds/alarm-calm.wav'); // Sound file path
      await audio.play(); // Wait for the sound to play
    } catch (error) {
      console.error('Failed to play sound:', error); // Handle any playback errors
    }
  };

  useEffect(() => {
    let timer;

    const handleEndOfTimer = () => {
      playSound() // Call playSound and handle its promise
        .catch((error) => console.error('Failed to play sound:', error));
      handleSessionSwitch(); // Switch to the next session
    };

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    } else if (timeLeft === 0) {
      handleEndOfTimer(); // Call the function when the timer reaches 0
    }

    return () => clearInterval(timer); // Clean up the interval
  }, [isRunning, timeLeft, handleSessionSwitch]);

  const startStopTimer = () => {
    if (
      sessionType === 'Short Break' &&
      timeLeft === SHORT_BREAK &&
      !isRunning
    ) {
      setShowBreakPrompt(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleBreakChoice = (choice) => {
    setBreakChoice(choice);
    setShowBreakPrompt(false);
    setIsRunning(true);
    setHasChosenBreak(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingRounds = Math.max(0, 3 - sessionCount);

  useEffect(() => {
    if (isRunning) {
      document.title = `${sessionType} - ${formatTime(timeLeft)}`;
    } else {
      document.title = 'FocusFlow | For Body & Mind';
    }

    return () => {
      document.title = 'FocusFlow | For Body & Mind'; // Reset title on unmount
    };
  }, [timeLeft, sessionType, isRunning]);

  return (
    <>
      {showBreakPrompt && <div className={styles.fullPageBlur} />}
      <div>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.switcherButton} ${sessionType === 'Focus' ? styles.active : styles.inactive}`}
            onClick={() => switchToSession('Focus')}
            disabled={isRunning && timeLeft > 0}
          >
            Focus Time
          </button>
          <button
            className={`${styles.switcherButton} ${sessionType === 'Short Break' ? styles.active : styles.inactive}`}
            onClick={() => switchToSession('Short Break')}
            disabled={isRunning && timeLeft > 0}
          >
            Short Break
          </button>
          <button
            className={`${styles.switcherButton} ${sessionType === 'Long Break' ? styles.active : styles.inactive}`}
            onClick={() => switchToSession('Long Break')}
            disabled={isRunning && timeLeft > 0}
          >
            Long Break
          </button>
        </div>

        <div className={styles.timerContainer}>
          <div className={styles.timerDisplay}>{formatTime(timeLeft)}</div>
          <StartPauseButton isRunning={isRunning} onClick={startStopTimer} />
          {sessionType === 'Focus' && sessionCount === 3 ? (
            <p className={styles.motivationMessage}>
              Keep on! Long break is almost there!
            </p>
          ) : sessionType === 'Focus' ? (
            <p className={styles.remainingRoundsText}>
              {remainingRounds} {remainingRounds === 1 ? 'round' : 'rounds'}{' '}
              left for the long break
            </p>
          ) : null}
        </div>
      </div>

      {showBreakPrompt && (
        <div className={styles.modal}>
          <p>Choose a break type:</p>
          <div className={styles.modalButtonGroup}>
            <button onClick={() => handleBreakChoice('Physical')}>
              Physical
            </button>
            <button onClick={() => handleBreakChoice('Breathing')}>
              Breathing
            </button>
            <button onClick={() => handleBreakChoice('Stretch')}>
              Stretch
            </button>
            <button onClick={() => handleBreakChoice('Meditation')}>
              Meditation
            </button>
          </div>
          <button
            className={styles.normalBreakText}
            onClick={() => handleBreakChoice('Normal Break')}
          >
            I just want a normal break
          </button>
        </div>
      )}

      {hasChosenBreak && selectedExercise && (
        <SelectedExerciseContainer
          selectedExercise={selectedExercise}
          breakType={breakChoice}
          exercises={exercises}
        />
      )}
    </>
  );
}

// --- LOCAL STORAGE TIMERS --- //
// 'use client';
// import { useCallback, useEffect, useMemo, useState } from 'react';
// import styles from '../styles/Timer.module.scss';
// import SelectedExerciseContainer from './SelectedExerciseContainer';
// import StartPauseButton from './StartPauseButton';

// const FOCUS_TIME = 60 * 25;
// const SHORT_BREAK = 60 * 5;
// const LONG_BREAK = 60 * 20;

// export default function Timers({ exercises }) {
//   const [timeLeft, setTimeLeft] = useState(() => {
//     const savedTime = localStorage.getItem('timeLeft');
//     return savedTime ? JSON.parse(savedTime) : FOCUS_TIME;
//   });

//   const [isRunning, setIsRunning] = useState(() => {
//     const savedRunning = localStorage.getItem('isRunning');
//     return savedRunning ? JSON.parse(savedRunning) : false;
//   });

//   const [sessionType, setSessionType] = useState(() => {
//     const savedSession = localStorage.getItem('sessionType');
//     return savedSession || 'Focus';
//   });

//   const [sessionCount, setSessionCount] = useState(() => {
//     const savedCount = localStorage.getItem('sessionCount');
//     return savedCount ? JSON.parse(savedCount) : 0;
//   });

//   const [showBreakPrompt, setShowBreakPrompt] = useState(false);
//   const [breakChoice, setBreakChoice] = useState('');
//   const [hasChosenBreak, setHasChosenBreak] = useState(false);

//   // Memoize selected exercise so it doesn't change unnecessarily
//   const selectedExercise = useMemo(() => {
//     if (!breakChoice) return null;
//     const filteredExercises = exercises.filter(
//       (exercise) => exercise.category === breakChoice,
//     );
//     return filteredExercises.length > 0
//       ? filteredExercises[Math.floor(Math.random() * filteredExercises.length)]
//       : {
//           id: 'default',
//           name: "Enjoy your break, and don't forget to drink water!",
//           category: 'General',
//           description: '',
//         };
//   }, [breakChoice, exercises]);

//   // Save state to localStorage
//   useEffect(() => {
//     localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
//     localStorage.setItem('isRunning', JSON.stringify(isRunning));
//     localStorage.setItem('sessionType', sessionType);
//     localStorage.setItem('sessionCount', JSON.stringify(sessionCount));
//   }, [timeLeft, isRunning, sessionType, sessionCount]);

//   const switchToSession = (session) => {
//     setIsRunning(false);
//     setBreakChoice('');

//     if (session === 'Focus') {
//       setSessionType('Focus');
//       setTimeLeft(FOCUS_TIME);
//     } else if (session === 'Short Break') {
//       setSessionType('Short Break');
//       setTimeLeft(SHORT_BREAK);
//     } else {
//       setSessionType('Long Break');
//       setTimeLeft(LONG_BREAK);
//     }
//   };

//   const handleSessionSwitch = useCallback(() => {
//     setBreakChoice('');
//     if (sessionType === 'Focus') {
//       setSessionCount((prevCount) => (prevCount + 1) % 4);
//       if (sessionCount === 3) {
//         setSessionType('Long Break');
//         setTimeLeft(LONG_BREAK);
//       } else {
//         setSessionType('Short Break');
//         setTimeLeft(SHORT_BREAK);
//       }
//     } else {
//       setSessionType('Focus');
//       setTimeLeft(FOCUS_TIME);
//     }
//     setIsRunning(false);
//   }, [sessionType, sessionCount]);

//   const playSound = async () => {
//     try {
//       const audio = new Audio('/sounds/alarm-calm.wav');
//       await audio.play();
//     } catch (error) {
//       console.error('Failed to play sound:', error);
//     }
//   };

//   useEffect(() => {
//     let timer;

//     const handleEndOfTimer = () => {
//       playSound().catch((error) =>
//         console.error('Failed to play sound:', error),
//       );
//       handleSessionSwitch();
//     };

//     if (isRunning && timeLeft > 0) {
//       timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
//     } else if (timeLeft === 0) {
//       handleEndOfTimer();
//     }

//     return () => clearInterval(timer); // Clean up the interval
//   }, [isRunning, timeLeft, handleSessionSwitch]);

//   const startStopTimer = () => {
//     if (
//       sessionType === 'Short Break' &&
//       timeLeft === SHORT_BREAK &&
//       !isRunning
//     ) {
//       setShowBreakPrompt(true);
//     } else {
//       setIsRunning((prev) => !prev);
//     }
//   };

//   const handleBreakChoice = (choice) => {
//     setBreakChoice(choice);
//     setShowBreakPrompt(false);
//     setIsRunning(true);
//     setHasChosenBreak(true);
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const remainingRounds = Math.max(0, 3 - sessionCount);

//   return (
//     <>
//       {showBreakPrompt && <div className={styles.fullPageBlur} />}
//       <div>
//         <div className={styles.buttonGroup}>
//           <button
//             className={`${styles.switcherButton} ${sessionType === 'Focus' ? styles.active : styles.inactive}`}
//             onClick={() => switchToSession('Focus')}
//             disabled={isRunning && timeLeft > 0}
//           >
//             Focus Time
//           </button>
//           <button
//             className={`${styles.switcherButton} ${sessionType === 'Short Break' ? styles.active : styles.inactive}`}
//             onClick={() => switchToSession('Short Break')}
//             disabled={isRunning && timeLeft > 0}
//           >
//             Short Break
//           </button>
//           <button
//             className={`${styles.switcherButton} ${sessionType === 'Long Break' ? styles.active : styles.inactive}`}
//             onClick={() => switchToSession('Long Break')}
//             disabled={isRunning && timeLeft > 0}
//           >
//             Long Break
//           </button>
//         </div>

//         <div className={styles.timerContainer}>
//           <div className={styles.timerDisplay}>{formatTime(timeLeft)}</div>
//           <StartPauseButton isRunning={isRunning} onClick={startStopTimer} />
//           {sessionType === 'Focus' && sessionCount === 3 ? (
//             <p className={styles.motivationMessage}>
//               Keep on! Long break is almost there!
//             </p>
//           ) : sessionType === 'Focus' ? (
//             <p className={styles.remainingRoundsText}>
//               {remainingRounds} {remainingRounds === 1 ? 'round' : 'rounds'}{' '}
//               left for the long break
//             </p>
//           ) : null}
//         </div>
//       </div>

//       {showBreakPrompt && (
//         <div className={styles.modal}>
//           <p>Choose a break type:</p>
//           <div className={styles.modalButtonGroup}>
//             <button onClick={() => handleBreakChoice('Physical')}>
//               Physical
//             </button>
//             <button onClick={() => handleBreakChoice('Breathing')}>
//               Breathing
//             </button>
//             <button onClick={() => handleBreakChoice('Stretch')}>
//               Stretch
//             </button>
//             <button onClick={() => handleBreakChoice('Meditation')}>
//               Meditation
//             </button>
//           </div>
//           <button
//             className={styles.normalBreakText}
//             onClick={() => handleBreakChoice('Normal Break')}
//           >
//             I just want a normal break
//           </button>
//         </div>
//       )}

//       {hasChosenBreak && selectedExercise && (
//         <SelectedExerciseContainer
//           selectedExercise={selectedExercise}
//           breakType={breakChoice}
//           exercises={exercises}
//         />
//       )}
//     </>
//   );
// }
