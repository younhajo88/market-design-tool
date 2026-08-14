import { Upload } from 'lucide-react';
import type { DragEvent } from 'react';

type ImageUploaderProps = {
  onImageLoaded: (image: HTMLImageElement) => void;
  onError: (message: string) => void;
};

export function ImageUploader({ onImageLoaded, onError }: ImageUploaderProps) {
  const loadFile = (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      onError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      onImageLoaded(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      onError('이미지를 불러오지 못했습니다. 다른 사진을 선택해주세요.');
    };
    image.src = objectUrl;
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files[0]);
  };

  return (
    <label
      className="upload-zone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <Upload aria-hidden="true" size={20} />
      <span>과일 사진 업로드</span>
      <small>PC는 드래그앤드롭 또는 파일 선택, 모바일은 파일 선택</small>
      <input
        aria-label="과일 사진 업로드"
        type="file"
        accept="image/*"
        onChange={(event) => loadFile(event.target.files?.[0])}
      />
    </label>
  );
}