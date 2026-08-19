declare module 'gif-encoder-2' {
  class GIFEncoder {
    constructor(width: number, height: number, algorithm?: string, useOptimizer?: boolean, totalFrames?: number);
    start(): void;
    setRepeat(repeat: number): void;
    setDelay(delay: number): void;
    setQuality(quality: number): void;
    addFrame(ctx: any): void;
    finish(): void;
    out: {
      getData(): Buffer;
    };
  }
  export default GIFEncoder;
}