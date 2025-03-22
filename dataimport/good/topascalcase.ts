export const toPascalCase = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s_\-]/g, "")
    .replace(/(?:^|[\s_\-])(\w)/g, (_, c) => c.toUpperCase());
};
