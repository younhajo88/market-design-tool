import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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
  it('renders a compact editor without title or instructional copy', () => {
    render(<App />);

    expect(screen.queryByRole('heading', { name: '홍보이미지디자인툴' })).not.toBeInTheDocument();
    expect(screen.queryByText('과일 사진을 올리고 문구만 바꿔 홍보 이미지를 저장하세요.')).not.toBeInTheDocument();
    expect(screen.getByLabelText('타이틀')).toHaveValue('');
    expect(screen.getByLabelText('서브타이틀')).toHaveValue('');
    expect(screen.getByLabelText('하단 타이틀')).toHaveValue('예약후 당일수령');
  });

  it('uses the existing blue as the default shared text outline color', () => {
    render(<App />);

    expect(screen.getByLabelText('글자 테두리 색상')).toHaveValue('#17207a');
  });

  it('updates the shared text outline color', async () => {
    const user = userEvent.setup();
    render(<App />);

    fireEvent.change(screen.getByLabelText('글자 테두리 색상'), { target: { value: '#c1121f' } });

    expect(screen.getByLabelText('글자 테두리 색상')).toHaveValue('#c1121f');
  });

  it('places the photo size control before text inputs', () => {
    render(<App />);

    const relation = screen.getByText('사진 크기').compareDocumentPosition(screen.getByText('타이틀'));

    expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('updates promo text inputs', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('타이틀'), '델몬트 바나나');

    expect(screen.getByLabelText('타이틀')).toHaveValue('델몬트 바나나');
  });

  it('does not show a low-resolution warning after upload', async () => {
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

    expect(screen.queryByText('원본 사진 해상도가 낮아 결과물이 흐릴 수 있습니다.')).not.toBeInTheDocument();
  });
});