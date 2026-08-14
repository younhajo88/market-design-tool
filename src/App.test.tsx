import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  naturalWidth = 800;
  naturalHeight = 700;
  width = 800;
  height = 700;

  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('renders the editor as the first screen', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '홍보이미지디자인툴' })).toBeInTheDocument();
    expect(screen.getByLabelText('타이틀')).toHaveValue('상품명');
    expect(screen.getByLabelText('서브타이틀')).toHaveValue('수량 또는 그람 및 가격');
    expect(screen.getByLabelText('하단 타이틀')).toHaveValue('예약후 당일수령');
  });

  it('updates promo text inputs', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByLabelText('타이틀'));
    await user.type(screen.getByLabelText('타이틀'), '델몬트 바나나');

    expect(screen.getByLabelText('타이틀')).toHaveValue('델몬트 바나나');
  });

  it('warns when the uploaded source image is lower than 1000 x 1000', async () => {
    vi.stubGlobal('Image', MockImage);
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:fruit-photo'),
      revokeObjectURL: vi.fn(),
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const user = userEvent.setup();
    render(<App />);

    const file = new File(['fruit'], 'banana.jpg', { type: 'image/jpeg' });
    await user.upload(screen.getByLabelText('과일 사진 업로드'), file);

    expect(
      await screen.findByText('원본 사진 해상도가 낮아 결과물이 흐릴 수 있습니다.'),
    ).toBeInTheDocument();
  });
});