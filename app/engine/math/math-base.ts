export const MathBase = {
  pi: 3.1415,
  deg2rad: 3.1415 / 180,
  rad2deg: 180 / 3.1415,
  eps: 0.00001,
};

export function isPowerOf2(value: number): boolean {
  // tslint:disable-next-line:no-bitwise
  return (value & (value - 1)) === 0;
}

export function isEqual(number1: number, number2: number): boolean {
  return Math.abs(number1 - number2) < MathBase.eps;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function div(val: number, by: number): number {
  return (val - val % by) / by;
}
