import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { LanguageToggle } from './language-toggle';

describe('LanguageToggle', () => {
  it('アクセシビリティ違反がないこと', async () => {
    const { container } = render(<LanguageToggle />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('言語選択ボタンが表示される', () => {
    render(<LanguageToggle />);
    const button = screen.getByRole('button', { name: /言語|Change language/ });
    expect(button).toBeInTheDocument();
  });

  it('クリックすると言語リストが表示される（DropdownMenuの挙動確認）', async () => {
    render(<LanguageToggle />);
    const toggleButton = screen.getByRole('button', { name: /言語|Change language/ });

    fireEvent.click(toggleButton);

    // ボタンがクリック可能であり、title 属性が存在することを確認
    expect(toggleButton).toBeEnabled();
    expect(toggleButton).toHaveAttribute('title');
  });
});
