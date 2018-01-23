export const MathBase = {
    pi: 3.1415,
    deg2rad: 3.1415 / 180,
    rad2deg: 180 / 3.1415,
    eps: 0.00001
};

export function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) == 0;
}
