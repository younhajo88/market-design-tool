import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExportActions } from './ExportActions';

describe('ExportActions', () => {
  it('disables webp save until an image is loaded', () => {
    render(<ExportActions canExport={false} onExport={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'WebP 저장' })).toBeDisabled();
  });

  it('calls export when the user saves a webp image', async () => {
    const user = userEvent.setup();
    const onExport = vi.fn().mockResolvedValue(undefined);
    render(<ExportActions canExport onExport={onExport} />);

    await user.click(screen.getByRole('button', { name: 'WebP 저장' }));

    expect(onExport).toHaveBeenCalledTimes(1);
  });
});
