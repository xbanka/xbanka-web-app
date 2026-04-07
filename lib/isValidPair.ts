export const isValidPair = (
  pairs: any[],
  source: string,
  target: string
) => {
  const sourceObj = pairs.find((p) => p.code === source);

  if (!sourceObj) return false;

  return sourceObj.pairs.some((p: any) => p.code === target);
};