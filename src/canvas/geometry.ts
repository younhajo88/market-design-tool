import type { ImageTransform } from '../types';
import { CANVAS_SIZE } from './constants';

export type SourceImageSize = { width: number; height: number };
export type DisplayRect = { width: number; height: number };

export function getCoverScale(source: SourceImageSize, targetSize = CANVAS_SIZE): number {
  return Math.max(targetSize / source.width, targetSize / source.height);
}

export function getMinimumCoverScale(source: SourceImageSize, targetSize = CANVAS_SIZE): number {
  return getCoverScale(source, targetSize);
}

export function clampScale(scale: number, source: SourceImageSize, targetSize = CANVAS_SIZE): number {
  return Math.max(scale, getMinimumCoverScale(source, targetSize));
}

export function getInitialTransform(source: SourceImageSize, targetSize = CANVAS_SIZE): ImageTransform {
  const scale = getCoverScale(source, targetSize);

  return {
    x: (targetSize - source.width * scale) / 2,
    y: (targetSize - source.height * scale) / 2,
    scale,
  };
}

export function displayDeltaToDesignDelta(
  deltaX: number,
  deltaY: number,
  display: DisplayRect,
  targetSize = CANVAS_SIZE,
): { x: number; y: number } {
  return {
    x: deltaX * (targetSize / display.width),
    y: deltaY * (targetSize / display.height),
  };
}
