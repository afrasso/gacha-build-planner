export function getRandomEnumValue<T extends object>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as T[keyof T];
}

export function getRandomElement<T>(arr: Array<T>): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
