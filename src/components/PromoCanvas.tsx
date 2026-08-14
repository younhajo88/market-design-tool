import { useEffect, useRef } from 'react';
import { CANVAS_SIZE } from '../canvas/constants';
import { displayDeltaToDesignDelta } from '../canvas/geometry';
import { renderPromo } from '../canvas/renderPromo';
import type { ImageTransform, PromoText } from '../types';

type PromoCanvasProps = {
  image: HTMLImageElement | null;
  text: PromoText;
  transform: ImageTransform;
  onTransformChange: (transform: ImageTransform) => void;
};

export function PromoCanvas({ image, text, transform, onTransformChange }: PromoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    renderPromo(ctx, image, text, transform);
  }, [image, text, transform]);

  return (
    <canvas
      ref={canvasRef}
      className="promo-canvas"
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      aria-label="홍보 이미지 편집 캔버스"
      onPointerDown={(event) => {
        if (!image) {
          return;
        }
        event.currentTarget.setPointerCapture(event.pointerId);
        lastPointerRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        const lastPointer = lastPointerRef.current;
        if (!image || !lastPointer) {
          return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        const delta = displayDeltaToDesignDelta(
          event.clientX - lastPointer.x,
          event.clientY - lastPointer.y,
          { width: rect.width, height: rect.height },
        );

        lastPointerRef.current = { x: event.clientX, y: event.clientY };
        onTransformChange({
          ...transform,
          x: transform.x + delta.x,
          y: transform.y + delta.y,
        });
      }}
      onPointerUp={() => {
        lastPointerRef.current = null;
      }}
      onPointerCancel={() => {
        lastPointerRef.current = null;
      }}
    />
  );
}
