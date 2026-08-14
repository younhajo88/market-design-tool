import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the editor as the first screen', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '홍보이미지디자인툴' })).toBeInTheDocument();
    expect(screen.getByLabelText('타이틀')).toHaveValue('상품명');
    expect(screen.getByLabelText('서브타이틀')).toHaveValue('수량 또는 그람 및 가격');
    expect(screen.getByLabelText('하단 타이틀')).toHaveValue('예약후 당일수령');
  });
});
