export const pluralize = (count: number, forms: [string, string, string]): string => {
  const [singular, few, many] = forms;
  if (count === 1) {
    return singular;
  }
  if (count >= 2 && count <= 4) {
    return few;
  }
  return many;
};
