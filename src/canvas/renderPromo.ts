import type { ImageTransform, PromoText } from '../types';
import { CANVAS_SIZE, TEMPLATE_BLUE, TEMPLATE_SHADOW, TEMPLATE_WHITE } from './constants';

const FONT_FAMILY = '"Arial Black", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';

type TextLine = {
  value: string;
  y: number;
  maxWidth: number;
  fontSize: number;
  strokeWidth: number;
};

export function renderPromo(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  text: PromoText,
  transform: ImageTransform,
): void {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.drawImage(
    source,
    transform.x,
    transform.y,
    getSourceWidth(source) * transform.scale,
    getSourceHeight(source) * transform.scale,
  );

  drawTemplateText(ctx, [
    { value: text.title, y: 94, maxWidth: 880, fontSize: 104, strokeWidth: 24 },
    { value: text.subtitle, y: 226, maxWidth: 780, fontSize: 88, strokeWidth: 22 },
    { value: text.footer, y: 912, maxWidth: 900, fontSize: 94, strokeWidth: 24 },
  ]);
}

function drawTemplateText(ctx: CanvasRenderingContext2D, lines: TextLine[]) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.fillStyle = TEMPLATE_WHITE;
  ctx.strokeStyle = TEMPLATE_BLUE;
  ctx.shadowColor = TEMPLATE_SHADOW;
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 7;
  ctx.shadowOffsetY = 9;

  for (const line of lines) {
    const fontSize = fitFontSize(ctx, line.value, line.fontSize, line.maxWidth);
    ctx.font = `900 ${fontSize}px ${FONT_FAMILY}`;
    ctx.lineWidth = line.strokeWidth;
    ctx.strokeText(line.value, CANVAS_SIZE / 2, line.y);
    ctx.fillText(line.value, CANVAS_SIZE / 2, line.y);
  }

  ctx.restore();
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  preferredSize: number,
  maxWidth: number,
): number {
  let fontSize = preferredSize;
  ctx.font = `900 ${fontSize}px ${FONT_FAMILY}`;

  while (fontSize > 34 && ctx.measureText(text).width > maxWidth) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize}px ${FONT_FAMILY}`;
  }

  return fontSize;
}

function getSourceWidth(source: CanvasImageSource): number {
  if ('naturalWidth' in source && source.naturalWidth) {
    return source.naturalWidth;
  }
  if ('videoWidth' in source && source.videoWidth) {
    return source.videoWidth;
  }
  return source.width;
}

function getSourceHeight(source: CanvasImageSource): number {
  if ('naturalHeight' in source && source.naturalHeight) {
    return source.naturalHeight;
  }
  if ('videoHeight' in source && source.videoHeight) {
    return source.videoHeight;
  }
  return source.height;
}
