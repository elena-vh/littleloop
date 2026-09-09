export const REPEAT_LEN = 8;

export function instructionFor(n: number): string {
  if (n < 1) return 'Cast on and join to work in the round.';
  return n % 2 === 1
    ? 'K2, m1L, knit to last 2 sts, m1R, k2.'
    : 'Knit all sts, slipping the markers as you pass them.';
}

export function stitchCountFor(row: number): number {
  return 118 + Math.floor(Math.max(0, row) / 2);
}

export function repeatInfo(row: number, total: number) {
  const repeatsTotal = Math.max(1, Math.ceil(total / REPEAT_LEN));
  const repeatIdx = row < 1 ? 0 : Math.floor((row - 1) / REPEAT_LEN) + 1;
  const withinRepeat = row < 1 ? 0 : ((row - 1) % REPEAT_LEN) + 1;
  return { repeatsTotal, repeatIdx, withinRepeat };
}

export function surroundingRows(row: number, total: number) {
  return [row - 2, row - 1, row, row + 1]
    .filter((n) => n >= 1 && n <= total)
    .map((n) => ({ n, text: instructionFor(n), current: n === row }));
}
