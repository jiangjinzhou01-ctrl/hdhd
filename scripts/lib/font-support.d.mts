export const FONT_URL: string;
export const FONT_SHA: string;
export function digest(data: string | Uint8Array): string;
export function codepoint(cp: number): string;
export function missingGlyphs(story: unknown): number[];
export function supplementDirectory(points: number[]): string;
export type FontReport = {
  sourceSHA256: string;
  version: string;
  codepoints: number[];
  files: Record<string, {sha256: string; bytes: number; codepoints: number[]}>;
};
export function loadSupplement(story: unknown): null | {directory: string; report: FontReport; missing: number[]};
