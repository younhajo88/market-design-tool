import { useState } from 'react';
import { DEFAULT_TEXT } from './canvas/constants';
import type { PromoText } from './types';
import './styles.css';

export default function App() {
  const [text, setText] = useState<PromoText>(DEFAULT_TEXT);

  const updateText = (field: keyof PromoText, value: string) => {
    setText((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="app-shell">
      <section className="editor-panel" aria-labelledby="app-title">
        <h1 id="app-title">홍보이미지디자인툴</h1>
        <div className="field-stack">
          <label>
            <span>타이틀</span>
            <input value={text.title} onChange={(event) => updateText('title', event.target.value)} />
          </label>
          <label>
            <span>서브타이틀</span>
            <input value={text.subtitle} onChange={(event) => updateText('subtitle', event.target.value)} />
          </label>
          <label>
            <span>하단 타이틀</span>
            <input value={text.footer} onChange={(event) => updateText('footer', event.target.value)} />
          </label>
        </div>
      </section>
      <section className="preview-panel" aria-label="홍보 이미지 미리보기">
        <div className="preview-placeholder">이미지를 업로드하면 여기에 표시됩니다.</div>
      </section>
    </main>
  );
}
