export function formatTime(time) {
  if (typeof time !== 'number' || time < 0 || !Number.isInteger(time)) {
    throw new Error('Pass only non-negative integers!');
  }

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
