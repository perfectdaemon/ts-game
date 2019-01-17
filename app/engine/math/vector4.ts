import { div } from './math-base';

export class Vector4 {
  /**
   * Creates new Vector4 from RGBA color
   * @param r 0..255
   * @param g 0..255
   * @param b 0..255
   * @param a 0..1
   */
  public static fromRgba(r: number, g: number, b: number, a: number): Vector4 {
    return new Vector4().setRgba(r, g, b, a);
  }

  /**
   * Creates new Vector4 from HSVA color
   * @param h 0..360
   * @param s 0..100
   * @param v 0..100
   * @param a 0..1
   */
  public static fromHsva(h: number, s: number, v: number, a: number): Vector4 {
    return new Vector4().setHsva(h, s, v, a);
  }

  /**
   * Creates new Vector4 from HSLA color
   * @param h 0..360
   * @param s 0..100
   * @param l 0..100
   * @param a 0..1
   */
  public static fromHsla(h: number, s: number, l: number, a: number): Vector4 {
    return new Vector4().setHsla(h, s, l, a);
  }

  constructor(public x: number = 0, public y: number = 0, public z: number = 0, public w: number = 0) {
  }

  set(x: Vector4 | number, y?: number, z?: number, w?: number): Vector4 {
    if (x instanceof Vector4) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    } else if (y !== undefined && z !== undefined && w !== undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    } else {
      throw new Error(`Vector.set() - x is number, but no y, z, w provided`);
    }

    return this;
  }

  asArray(): number[] {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * Set RGBA color
   * @param r 0..255
   * @param g 0..255
   * @param b 0..255
   * @param a 0..1
   */
  setRgba(r: number, g: number, b: number, a: number): Vector4 {
    return this.set(r / 255, g / 255, b / 255, a);
  }

  /**
   * Set HSVA color
   * @param h 0..360
   * @param s 0..100
   * @param v 0..100
   * @param a 0..1
   */
  setHsva(h: number, s: number, v: number, a: number): Vector4 {
    h = h / 360;
    s = s / 100;
    v = v / 100;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: return this.set(v, t, p, a);
        case 1: return this.set(q, v, p, a);
        case 2: return this.set(p, v, t, a);
        case 3: return this.set(p, q, v, a);
        case 4: return this.set(t, p, v, a);
        case 5: return this.set(v, p, q, a);
    }

    throw new Error(`Hsv conversion failed for [${h}, ${s}, ${v}]`);
  }

  /**
   * Set HSLA color
   * @param h 0..360
   * @param s 0..100
   * @param l 0..100
   * @param a 0..1
   */
  setHsla(h: number, s: number, l: number, a: number): Vector4 {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    if (s === 0) {
      return this.set(l, l, l, a);
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      return this.set(this.hueToRgb(p, q, h + 1 / 3), this.hueToRgb(p, q, h), this.hueToRgb(p, q, h - 1 / 3), a);
    }
  }

  private hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }
    if (t < 1 / 6) { return p + (q - p) * 6 * t; }
    if (t < 1 / 2) { return q; }
    if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
    return p;
  }
}
