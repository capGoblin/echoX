declare module "@download/blockies" {
  interface BlockiesOptions {
    seed: string;
    size?: number;
    scale?: number;
    color?: string;
    bgcolor?: string;
    spotcolor?: string;
  }

  export function createIcon(options: BlockiesOptions): HTMLCanvasElement;
}
