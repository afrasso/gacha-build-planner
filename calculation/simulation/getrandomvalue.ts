export const getRandomValue = <T>(arr: Array<T>) => {
  if (!arr) {
    throw new Error("Unexpected error: arr cannot be null or undefined.");
  }
  return arr[Math.floor(Math.random() * arr.length)];
};
