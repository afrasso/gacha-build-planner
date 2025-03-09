export const mapEnumToKey = <S extends Record<string, number | string>>(
  sourceEnum: S,
  sourceValue: S[keyof S]
): string => {
  const key = Object.keys(sourceEnum).find((k) => sourceEnum[k as keyof S] === sourceValue);
  if (!key) {
    throw new Error(`No matching key found for value: ${sourceValue}`);
  }
  return key;
};
