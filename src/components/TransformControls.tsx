type TransformControlsProps = {
  scale: number;
  minimumScale: number;
  onScaleChange: (scale: number) => void;
  disabled: boolean;
};

export function TransformControls({
  scale,
  minimumScale,
  onScaleChange,
  disabled,
}: TransformControlsProps) {
  return (
    <label className="slider-field">
      <span>사진 크기</span>
      <input
        type="range"
        min={minimumScale}
        max={minimumScale * 3}
        step={0.01}
        value={scale}
        disabled={disabled}
        onChange={(event) => onScaleChange(Number(event.target.value))}
      />
    </label>
  );
}