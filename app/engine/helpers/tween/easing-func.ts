export type EasingFunc = (start: number, diff: number, unit: number) => number;

export const easingFunctions: {
  expoEaseIn: EasingFunc,
  quintEaseOut: EasingFunc,
  elasticEaseIn: EasingFunc,
  simple: EasingFunc,
} = {
    expoEaseIn: (start, diff, unit) => unit === 1 ? start + diff : diff * (-Math.pow(2, -15 * unit) + 1) + start,
    quintEaseOut: (start, diff, unit) => start,
    elasticEaseIn: (start, diff, unit) =>
      unit === 1
        ? start + diff
        : (diff === 0 || unit === 0)
          ? start
          : (diff * Math.pow(2, -10 * unit) * Math.sin((unit - 0.25 / 4) * (2 * 3.14) / 0.25)) + diff + start,
    simple: (start, diff, unit) => unit === 1 ? start + diff : start + diff * unit,
  };
