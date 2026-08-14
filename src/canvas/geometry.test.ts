import { describe, expect, it } from 'vitest';
import {
  clampScale,
  displayDeltaToDesignDelta,
  getCoverScale,
  getInitialTransform,
} from './geometry';

describe('canvas geometry', () => {
  it('calculates cover scale for portrait photos', () => {
    expect(getCoverScale({ width: 2000, height: 4000 })).toBe(0.5);
  });

  it('centers the source image at cover scale', () => {
    expect(getInitialTransform({ width: 2000, height: 4000 })).toEqual({
      x: 0,
      y: -500,
      scale: 0.5,
    });
  });

  it('does not allow scale below the cover minimum', () => {
    expect(clampScale(0.1, { width: 2000, height: 4000 })).toBe(0.5);
  });

  it('maps displayed pointer movement to design-space movement', () => {
    expect(displayDeltaToDesignDelta(50, -25, { width: 500, height: 500 })).toEqual({
      x: 100,
      y: -50,
    });
  });
});
