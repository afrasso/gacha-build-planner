export const getEnumValues = <T extends { [key: string]: unknown }>(enumObj: T): T[keyof T][] => {
  return Object.values(enumObj) as T[keyof T][];
};
