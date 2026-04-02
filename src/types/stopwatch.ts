export type LapData =
  | { isActive: true; start: number; finish: number }
  | { isActive: false; start: number; finish: number; order: number };