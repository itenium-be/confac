export function parseIntOrFloat(str: string, asFloat: boolean): number {
  if (!str) {
    return 0;
  }
  if (asFloat) {
    return parseFloat(str);
  }
  return parseInt(str, 10);
}
