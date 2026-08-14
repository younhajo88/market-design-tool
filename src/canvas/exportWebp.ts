import type { ExportFormat, ExportMimeType, ExportResult, ImageTransform, PromoStyle, PromoText } from '../types';
import { CANVAS_SIZE, DEFAULT_PROMO_STYLE, WEBP_QUALITY } from './constants';
import { renderPromo } from './renderPromo';

const FORMAT_CONFIG: Record<ExportFormat, { mimeType: ExportMimeType; quality?: number }> = {
  jpg: { mimeType: 'image/jpeg', quality: 0.95 },
  webp: { mimeType: 'image/webp', quality: WEBP_QUALITY },
  png: { mimeType: 'image/png' },
};

export function formatExportFileName(format: ExportFormat, now: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `market-design-${year}${month}${day}-${hour}${minute}${second}.${format}`;
}

export async function exportImage(
  source: CanvasImageSource,
  text: PromoText,
  transform: ImageTransform,
  format: ExportFormat,
  now = new Date(),
  style: PromoStyle = DEFAULT_PROMO_STYLE,
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
  renderPromo(ctx, source, text, transform, style);

  const config = FORMAT_CONFIG[format];
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, config.mimeType, config.quality);
  });

  if (!blob) {
    throw new Error('IMAGE_EXPORT_FAILED');
  }

  return {
    blob,
    fileName: formatExportFileName(format, now),
    mimeType: config.mimeType,
  };
}

export function exportWebp(
  source: CanvasImageSource,
  text: PromoText,
  transform: ImageTransform,
  now = new Date(),
): Promise<ExportResult> {
  return exportImage(source, text, transform, 'webp', now);
}