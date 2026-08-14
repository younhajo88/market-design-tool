import type { ExportResult, ImageTransform, PromoText } from '../types';
import { CANVAS_SIZE, WEBP_QUALITY } from './constants';
import { renderPromo } from './renderPromo';

export function formatExportFileName(now: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `market-design-${year}${month}${day}-${hour}${minute}${second}.webp`;
}

export async function exportWebp(
  source: CanvasImageSource,
  text: PromoText,
  transform: ImageTransform,
  now = new Date(),
): Promise<ExportResult> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  renderPromo(ctx, source, text, transform);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY);
  });

  if (!blob) {
    throw new Error('WEBP_EXPORT_FAILED');
  }

  return {
    blob,
    fileName: formatExportFileName(now),
    mimeType: 'image/webp',
  };
}
