export const minutesElapsed = (start: number, end: number): string => {
  return ((end - start) / 1000 / 60).toFixed(2);
};
