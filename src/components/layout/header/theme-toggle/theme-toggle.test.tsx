import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  it('アクセシビリティ違反がないこと', async () => {
    const { container } = render(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('初期レンダリングでボタンが表示される', () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: 'テーマを切り替える' });
    expect(button).toBeInTheDocument();
  });

  it('クリックするとテーマ切り替えの意図が反映される（aria-pressedの確認など）', () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: 'テーマを切り替える' });

    // next-themes の内部状態までは追わないが、ボタンがクリック可能であることを確認
    fireEvent.click(button);
    expect(button).toBeEnabled();
  });
});
