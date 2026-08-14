import { describe, expect, it } from 'vitest';
import { renderPromo } from './renderPromo';
import { DEFAULT_TEXT, TEMPLATE_BLUE } from './constants';

function createContextMock() {
  return {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 20 })),
    restore: vi.fn(),
    save: vi.fn(),
    strokeText: vi.fn(),
    fillStyle: '',
    font: '',
    lineJoin: '',
    lineWidth: 0,
    shadowBlur: 0,
    shadowColor: '',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    strokeStyle: '',
    textAlign: '',
    textBaseline: '',
  } as unknown as CanvasRenderingContext2D;
}

describe('renderPromo', () => {
  it('uses the default blue outline color when no style is provided', () => {
    const ctx = createContextMock();

    renderPromo(ctx, new Image(), DEFAULT_TEXT, { x: 0, y: 0, scale: 1 });

    expect(ctx.strokeStyle).toBe(TEMPLATE_BLUE);
  });

  it('uses the shared outline color for all text lines', () => {
    const ctx = createContextMock();

    renderPromo(ctx, new Image(), DEFAULT_TEXT, { x: 0, y: 0, scale: 1 }, { strokeColor: '#c1121f' });

    expect(ctx.strokeStyle).toBe('#c1121f');
    expect(ctx.strokeText).toHaveBeenCalledTimes(3);
  });
});