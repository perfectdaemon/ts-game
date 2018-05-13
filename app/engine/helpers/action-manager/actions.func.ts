export type SimpleAction = () => void;

export type ContinuousAction = (deltaTime: number) => boolean | void;
