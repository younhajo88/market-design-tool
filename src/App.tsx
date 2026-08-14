import { useMemo, useState } from 'react';
import { CANVAS_SIZE, DEFAULT_TEXT } from './canvas/constants';
import { exportWebp } from './canvas/exportWebp';
import { clampScale, getInitialTransform, getMinimumCoverScale } from './canvas/geometry';
import { ExportActions, downloadBlob } from './components/ExportActions';
import { ImageUploader } from './components/ImageUploader';
import { PromoCanvas } from './components/PromoCanvas';
import { TextControls } from './components/TextControls';
import { TransformControls } from './components/TransformControls';
import type { ImageTransform, PromoText } from './types';
import './styles.css';

const EMPTY_TRANSFORM: ImageTransform = { x: 0, y: 0, scale: 1 };

export default function App() {
  const [text, setText] = useState<PromoText>(DEFAULT_TEXT);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<ImageTransform>(EMPTY_TRANSFORM);
  const [message, setMessage] = useState<string>('');
  const [warning, setWarning] = useState<string>('');

  const minimumScale = useMemo(() => {
    if (!image) {
      return 1;
    }
    return getMinimumCoverScale({ width: image.naturalWidth, height: image.naturalHeight });
  }, [image]);

  const updateText = (field: keyof PromoText, value: string) => {
    setText((current) => ({ ...current, [field]: value }));
  };

  const handleImageLoaded = (loadedImage: HTMLImageElement) => {
    setImage(loadedImage);
    setTransform(getInitialTransform({ width: loadedImage.naturalWidth, height: loadedImage.naturalHeight }));
    setMessage('');
    setWarning(
      loadedImage.naturalWidth < CANVAS_SIZE || loadedImage.naturalHeight < CANVAS_SIZE
        ? '원본 사진 해상도가 낮아 결과물이 흐릴 수 있습니다.'
        : '',
    );
  };

  const handleScaleChange = (scale: number) => {
    if (!image) {
      return;
    }
    setTransform((current) => ({
      ...current,
      scale: clampScale(scale, { width: image.naturalWidth, height: image.naturalHeight }),
    }));
  };

  const handleExport = async () => {
    if (!image) {
      return;
    }

    try {
      const result = await exportWebp(image, text, transform);
      downloadBlob(result.blob, result.fileName);
      setMessage('');
    } catch {
      setMessage('이미지 저장에 실패했습니다. 브라우저를 업데이트하거나 다른 브라우저에서 다시 시도해주세요.');
    }
  };

  const handleShare = async () => {
    if (!image || !navigator.share) {
      return;
    }

    try {
      const result = await exportWebp(image, text, transform);
      const file = new File([result.blob], result.fileName, { type: result.mimeType });
      await navigator.share({ files: [file], title: '홍보이미지디자인툴' });
      setMessage('');
    } catch {
      setMessage('이미지 저장에 실패했습니다. 브라우저를 업데이트하거나 다른 브라우저에서 다시 시도해주세요.');
    }
  };

  const canShare = (() => {
    if (!image || !navigator.share || !navigator.canShare) {
      return false;
    }
    const probeFile = new File([new Blob(['probe'], { type: 'image/webp' })], 'probe.webp', {
      type: 'image/webp',
    });
    return navigator.canShare({ files: [probeFile] });
  })();

  return (
    <main className="app-shell">
      <section className="editor-panel" aria-labelledby="app-title">
        <div className="title-block">
          <h1 id="app-title">홍보이미지디자인툴</h1>
          <p>과일 사진을 올리고 문구만 바꿔 WebP 홍보 이미지를 저장하세요.</p>
        </div>

        <ImageUploader onImageLoaded={handleImageLoaded} onError={setMessage} />
        {message ? <p className="status-message" role="alert">{message}</p> : null}
        {warning ? <p className="warning-message">{warning}</p> : null}

        <TextControls value={text} onChange={updateText} />
        <TransformControls
          scale={transform.scale}
          minimumScale={minimumScale}
          disabled={!image}
          onScaleChange={handleScaleChange}
        />
        <ExportActions
          canExport={Boolean(image)}
          canShare={canShare}
          onExport={handleExport}
          onShare={handleShare}
        />
      </section>

      <section className="preview-panel" aria-label="홍보 이미지 미리보기">
        <div className="canvas-frame">
          <PromoCanvas
            image={image}
            text={text}
            transform={transform}
            onTransformChange={setTransform}
          />
          {!image ? <div className="preview-placeholder">이미지를 업로드하면 여기에 표시됩니다.</div> : null}
        </div>
      </section>
    </main>
  );
}