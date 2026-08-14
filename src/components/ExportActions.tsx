import { Download, Share2 } from 'lucide-react';
import { useState } from 'react';

type ExportActionsProps = {
  canExport: boolean;
  canShare?: boolean;
  onExport: () => Promise<void>;
  onShare?: () => Promise<void>;
};

export function ExportActions({ canExport, canShare = false, onExport, onShare }: ExportActionsProps) {
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
    <div className="export-actions">
      <button type="button" disabled={!canExport || busy} onClick={() => run(onExport)}>
        <Download aria-hidden="true" size={18} />
        WebP 저장
      </button>
      {canShare && onShare ? (
        <button type="button" disabled={!canExport || busy} onClick={() => run(onShare)}>
          <Share2 aria-hidden="true" size={18} />
          공유
        </button>
      ) : null}
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
