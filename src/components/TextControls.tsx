import type { PromoText } from '../types';

type TextControlsProps = {
  value: PromoText;
  strokeColor: string;
  onChange: (field: keyof PromoText, value: string) => void;
  onStrokeColorChange: (color: string) => void;
};

export function TextControls({ value, strokeColor, onChange, onStrokeColorChange }: TextControlsProps) {
  return (
    <div className="field-stack">
      <label className="color-field">
        <span>글자 테두리 색상</span>
        <input
          type="color"
          value={strokeColor}
          onChange={(event) => onStrokeColorChange(event.target.value)}
        />
      </label>
      <label>
        <span>타이틀</span>
        <input value={value.title} onChange={(event) => onChange('title', event.target.value)} />
      </label>
      <label>
        <span>서브타이틀</span>
        <input value={value.subtitle} onChange={(event) => onChange('subtitle', event.target.value)} />
      </label>
      <label>
        <span>하단 타이틀</span>
        <input value={value.footer} onChange={(event) => onChange('footer', event.target.value)} />
      </label>
    </div>
  );
}