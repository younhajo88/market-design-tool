import { Download, Share2 } from 'lucide-react';
import { useState } from 'react';
import type { ExportFormat } from '../types';

type ExportActionsProps = {
  canExport: boolean;
  canShare?: boolean;
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  onExport: () => Promise<void>;
  onShare?: () => Promise<void>;
};

const FORMAT_OPTIONS: Array<{ value: ExportFormat; label: string }> = [
  { value: 'jpg', label: 'JPG' },
  { value: 'webp', label: 'WebP' },
  { value: 'png', label: 'PNG' },
];

export function ExportActions({
  canExport,
  canShare = false,
  format,
  onFormatChange,
  onExport,
  onShare,
}: ExportActionsProps) {
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="export-section">
      <div className="export-actions">
        <button type="button" disabled={!canExport || busy} onClick={() => run(onExport)}>
          <Download aria-hidden="true" size={18} />
          저장
        </button>
        {canShare && onShare ? (
          <button type="button" disabled={!canExport || busy} onClick={() => run(onShare)}>
            <Share2 aria-hidden="true" size={18} />
            공유
          </button>
        ) : null}
      </div>
      <label className="format-field">
        <span>저장 확장자</span>
        <select
          value={format}
          onChange={(event) => onFormatChange(event.target.value as ExportFormat)}
        >
          {FORMAT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}