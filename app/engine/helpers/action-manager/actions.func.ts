export type SimpleAction = () => void;

export type ContinuousAction = (deltaTime: number, timeElapsed: number) => boolean | void;
