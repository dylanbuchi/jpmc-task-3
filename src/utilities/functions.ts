export const calculateAverage = (values: number[]) =>
  values.reduce((a, b) => a + b) / values.length;
