export type PromoText = {
  title: string;
  subtitle: string;
  footer: string;
};

export type ImageTransform = {
  x: number;
  y: number;
  scale: number;
};

export type ExportResult = {
  blob: Blob;
  fileName: string;
  mimeType: 'image/webp';
};
