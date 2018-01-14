import { IndexFormat } from "./webgl-types";

export class IndexBuffer {
    constructor(data: any,
        public format: IndexFormat,
        public count: number) {

    }

    public free(): void {

    }

    public bind(): void {

    }

    public update(data: any, start: number, count: number): void {

    }
}