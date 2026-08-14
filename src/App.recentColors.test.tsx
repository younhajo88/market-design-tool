import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { exportImage } from './canvas/exportWebp';
import { RECENT_OUTLINE_COLORS_KEY } from './recentColors';

vi.mock('./canvas/exportWebp', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./canvas/exportWebp')>();
  return {
    ...actual,
    exportImage: vi.fn(async () => ({
      blob: new Blob(['image'], { type: 'image/jpeg' }),
      fileName: 'market-design-test.jpg',
      mimeType: 'image/jpeg' as const,
    })),
  };
});

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  naturalWidth = 1600;
  naturalHeight = 1200;
  width = 1600;
  height = 1200;

  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

const mockedExportImage = vi.mocked(exportImage);

function getColorInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>('input[type="color"]');
  if (!input) {
    throw new Error('Color input not found');
  }
  return input;
}

async function uploadFruitPhoto() {
  vi.stubGlobal('Image', MockImage);
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:fruit-photo'),
    revokeObjectURL: vi.fn(),
  });
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

  const uploadInput = document.querySelector<HTMLInputElement>('input[type="file"]');
  if (!uploadInput) {
    throw new Error('Upload input not found');
  }

  await userEvent.upload(uploadInput, new File(['fruit'], 'banana.jpg', { type: 'image/jpeg' }));
}

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  mockedExportImage.mockClear();
});

describe('recent outline colors in App', () => {
  it('shows stored recent outline colors below the outline color control', () => {
    localStorage.setItem(RECENT_OUTLINE_COLORS_KEY, JSON.stringify(['#c1121f', '#17207a']));

    render(<App />);

    expect(screen.getByRole('button', { name: '최근 색상 #c1121f' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '최근 색상 #17207a' })).toBeInTheDocument();
  });

  it('records the selected outline color only after saving and avoids duplicates', async () => {
    const { container } = render(<App />);
    const colorInput = getColorInput(container);

    fireEvent.change(colorInput, { target: { value: '#c1121f' } });
    expect(localStorage.getItem(RECENT_OUTLINE_COLORS_KEY)).toBeNull();

    await uploadFruitPhoto();
    await waitFor(() => expect(screen.getByRole('button', { name: /저장/ })).toBeEnabled());

    await userEvent.click(screen.getByRole('button', { name: /저장/ }));
    expect(JSON.parse(localStorage.getItem(RECENT_OUTLINE_COLORS_KEY) ?? '[]')).toEqual(['#c1121f']);

    await userEvent.click(screen.getByRole('button', { name: /저장/ }));
    expect(JSON.parse(localStorage.getItem(RECENT_OUTLINE_COLORS_KEY) ?? '[]')).toEqual(['#c1121f']);
  });
});