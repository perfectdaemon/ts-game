import { MathBase } from './math-base';

export class Vector {
    constructor(public x: number, public y: number) {}

    toAngle(): number {
        return Math.atan2(this.y, this.x) * MathBase.rad2deg;
    }

    lengthQ(): number {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }

    length(): number {
        return Math.sqrt(this.lengthQ());
    }

    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    multiply(value: number) {
        return new Vector(this.x * value, this.y * value);
    }

    normal(): Vector {
        const len = this.length();
        
        if (len < MathBase.eps) 
            return new Vector(0, 0);
        
        return this.multiply(1 / len);
    }

    toString(): string {
        return `x: ${this.x}, y:${this.y}`;
    }
}
