import { describe, expect, it } from 'vitest';
import { DEFAULT_TEXT } from './constants';
import { exportWebp, formatExportFileName } from './exportWebp';
import { installCanvasMock } from '../test/canvasMock';

describe('WebP export', () => {
  it('creates a timestamped webp filename', () => {
    expect(formatExportFileName(new Date('2026-08-14T09:08:07'))).toBe(
      'market-design-20260814-090807.webp',
    );
  });

  it('renders to a 1000 x 1000 high-quality webp canvas', async () => {
    const mock = installCanvasMock();
    const source = new Image();

    const result = await exportWebp(
      source,
      DEFAULT_TEXT,
      { x: 0, y: 0, scale: 1 },
      new Date('2026-08-14T09:08:07'),
    );

    expect(mock.canvas.width).toBe(1000);
    expect(mock.canvas.height).toBe(1000);
    expect(mock.context.imageSmoothingEnabled).toBe(true);
    expect(mock.context.imageSmoothingQuality).toBe('high');
    expect(mock.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.98);
    expect(result.mimeType).toBe('image/webp');
    expect(result.fileName).toBe('market-design-20260814-090807.webp');
  });

  it('rejects when the browser cannot create a webp blob', async () => {
    installCanvasMock({ blob: null });

    await expect(
      exportWebp(new Image(), DEFAULT_TEXT, { x: 0, y: 0, scale: 1 }),
    ).rejects.toThrow('WEBP_EXPORT_FAILED');
  });
});
