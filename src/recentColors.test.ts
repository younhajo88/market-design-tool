import { describe, expect, it } from 'vitest';
import { addRecentColor, readRecentColors, RECENT_OUTLINE_COLORS_KEY } from './recentColors';

describe('recent outline colors', () => {
  it('stores the newest color first and keeps at most five colors', () => {
    const result = addRecentColor(['#111111', '#222222', '#333333', '#444444', '#555555'], '#666666');

    expect(result).toEqual(['#666666', '#111111', '#222222', '#333333', '#444444']);
  });

  it('moves an existing color to the front without duplicating it', () => {
    const result = addRecentColor(['#111111', '#222222', '#333333'], '#222222');

    expect(result).toEqual(['#222222', '#111111', '#333333']);
  });

  it('ignores invalid stored recent colors', () => {
    localStorage.setItem(RECENT_OUTLINE_COLORS_KEY, JSON.stringify(['#123456', 'blue', '#abcdef']));

    expect(readRecentColors()).toEqual(['#123456', '#abcdef']);
  });
});