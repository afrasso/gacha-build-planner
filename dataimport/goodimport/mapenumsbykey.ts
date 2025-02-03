export const mapEnumsByKey = <S extends Record<string, number | string>, T extends Record<string, number | string>>(
  sourceEnum: S,
  targetEnum: T,
  sourceValue: S[keyof S]
): T[keyof T] => {
  const key = Object.keys(sourceEnum).find((k) => sourceEnum[k as keyof S] === sourceValue);
  if (!key) {
    throw new Error(`No matching key found for value: ${sourceValue}`);
  }
  return targetEnum[key as keyof T];
};
