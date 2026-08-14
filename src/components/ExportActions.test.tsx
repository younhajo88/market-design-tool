import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExportActions } from './ExportActions';

describe('ExportActions', () => {
  it('disables save until an image is loaded', () => {
    render(<ExportActions canExport={false} format="jpg" onFormatChange={vi.fn()} onExport={vi.fn()} />);

    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('uses jpg as the selected default format', () => {
    render(<ExportActions canExport format="jpg" onFormatChange={vi.fn()} onExport={vi.fn()} />);

    expect(screen.getByLabelText('저장 확장자')).toHaveValue('jpg');
  });

  it('calls format change when the dropdown selection changes', async () => {
    const user = userEvent.setup();
    const onFormatChange = vi.fn();
    render(<ExportActions canExport format="jpg" onFormatChange={onFormatChange} onExport={vi.fn()} />);

    await user.selectOptions(screen.getByLabelText('저장 확장자'), 'webp');

    expect(onFormatChange).toHaveBeenCalledWith('webp');
  });

  it('calls export when the user saves an image', async () => {
    const user = userEvent.setup();
    const onExport = vi.fn().mockResolvedValue(undefined);
    render(<ExportActions canExport format="jpg" onFormatChange={vi.fn()} onExport={onExport} />);

    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(onExport).toHaveBeenCalledTimes(1);
  });
});