import { expect, test } from '@jest/globals';
import { formatTime } from '../time';

test('formats time to MM:SS format', () => {
  expect(formatTime(75)).toBe('01:15'); // 1 minute 15 seconds
  expect(formatTime(60)).toBe('01:00'); // Exactly 1 minute
  expect(formatTime(30)).toBe('00:30'); // Less than 1 minute
  expect(formatTime(0)).toBe('00:00'); // Zero seconds
  expect(formatTime(3672)).toBe('61:12'); // Large time values
  expect(formatTime(9)).toBe('00:09'); // Single-digit seconds
});

test('throws an error for invalid inputs', () => {
  expect(() => formatTime(-1)).toThrow('Pass only non-negative integers!'); // Negative numbers
  expect(() => formatTime('75')).toThrow('Pass only non-negative integers!'); // Non-numeric string
  expect(() => formatTime(75.5)).toThrow('Pass only non-negative integers!'); // Non-integer
  expect(() => formatTime(null)).toThrow('Pass only non-negative integers!'); // Null
  expect(() => formatTime(undefined)).toThrow(
    'Pass only non-negative integers!',
  ); // Undefined
  expect(() => formatTime({})).toThrow('Pass only non-negative integers!'); // Invalid object
});
