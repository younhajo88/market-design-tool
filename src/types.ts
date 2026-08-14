export type PromoText = {
  title: string;
  subtitle: string;
  footer: string;
};

export type PromoStyle = {
  strokeColor: string;
};

export type ImageTransform = {
  x: number;
  y: number;
  scale: number;
};

export type ExportFormat = 'jpg' | 'webp' | 'png';

export type ExportMimeType = 'image/jpeg' | 'image/webp' | 'image/png';

export type ExportResult = {
  blob: Blob;
  fileName: string;
  mimeType: ExportMimeType;
};