class CCapture {
  constructor(settings?: object);

  save(): void;
  start(): void;
  capture(canvas: any): void;
  stop(): void;
}
declare interface Object {
  entries(): [String, any];
}
