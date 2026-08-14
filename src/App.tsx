import { useMemo, useState } from 'react';
import { CANVAS_SIZE, DEFAULT_TEXT } from './canvas/constants';
import { clampScale, getInitialTransform, getMinimumCoverScale } from './canvas/geometry';
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