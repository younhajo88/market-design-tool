import { describe, expect, it } from 'vitest';
import { DEFAULT_TEXT } from './constants';
import { exportImage, exportWebp, formatExportFileName } from './exportWebp';
import { installCanvasMock } from '../test/canvasMock';

describe('image export', () => {
  it('creates timestamped filenames for each supported extension', () => {
    const now = new Date('2026-08-14T09:08:07');

    expect(formatExportFileName('jpg', now)).toBe('market-design-20260814-090807.jpg');
    expect(formatExportFileName('webp', now)).toBe('market-design-20260814-090807.webp');
    expect(formatExportFileName('png', now)).toBe('market-design-20260814-090807.png');
  });

  it('renders jpg to a 1000 x 1000 high-quality canvas', async () => {
    const mock = installCanvasMock();
    const source = new Image();

    const result = await exportImage(
      source,
      DEFAULT_TEXT,
      { x: 0, y: 0, scale: 1 },
      'jpg',
      new Date('2026-08-14T09:08:07'),
    );

    expect(mock.canvas.width).toBe(1000);
    expect(mock.canvas.height).toBe(1000);
    expect(mock.context.imageSmoothingEnabled).toBe(true);
    expect(mock.context.imageSmoothingQuality).toBe('high');
    expect(mock.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.95);
    expect(result.mimeType).toBe('image/jpeg');
    expect(result.fileName).toBe('market-design-20260814-090807.jpg');
  });

  it('keeps the existing webp export wrapper at quality 0.98', async () => {
    const mock = installCanvasMock();
    const source = new Image();

    const result = await exportWebp(source, DEFAULT_TEXT, { x: 0, y: 0, scale: 1 }, new Date('2026-08-14T09:08:07'));

    expect(mock.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.98);
    expect(result.mimeType).toBe('image/webp');
    expect(result.fileName).toBe('market-design-20260814-090807.webp');
  });

  it('renders png without a lossy quality parameter', async () => {
    const mock = installCanvasMock();

    const result = await exportImage(new Image(), DEFAULT_TEXT, { x: 0, y: 0, scale: 1 }, 'png');

    expect(mock.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png', undefined);
    expect(result.mimeType).toBe('image/png');
    expect(result.fileName.endsWith('.png')).toBe(true);
  });

  it('rejects when the browser cannot create an image blob', async () => {
    installCanvasMock({ blob: null });

    await expect(
      exportImage(new Image(), DEFAULT_TEXT, { x: 0, y: 0, scale: 1 }, 'jpg'),
    ).rejects.toThrow('IMAGE_EXPORT_FAILED');
  });
});