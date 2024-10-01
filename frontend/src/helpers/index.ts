export function formatNumberToMillions(number: number): string {
  return parseInt(number / 1000000 + "") + "";
}

export function generateRandomCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
