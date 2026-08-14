import { vi } from 'vitest';

type CanvasMockOptions = {
  blob?: Blob | null;
};

export function installCanvasMock(options: CanvasMockOptions = {}) {
  vi.restoreAllMocks();
  const originalCreateElement = document.createElement.bind(document);
  const blob = options.blob === undefined ? new Blob(['webp'], { type: 'image/webp' }) : options.blob;
  const context = {
    canvas: null as unknown as HTMLCanvasElement,
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 50 })),
    restore: vi.fn(),
    save: vi.fn(),
    strokeText: vi.fn(),
    imageSmoothingEnabled: false,
    imageSmoothingQuality: 'low' as ImageSmoothingQuality,
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
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => context),
    toBlob: vi.fn((callback: BlobCallback) => callback(blob)),
  } as unknown as HTMLCanvasElement;

  context.canvas = canvas;
  vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
    if (tagName === 'canvas') {
      return canvas;
    }
    return originalCreateElement(tagName);
  });

  return { canvas, context, toBlob: canvas.toBlob as ReturnType<typeof vi.fn> };
}
