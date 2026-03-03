/** @vitest-environment happy-dom */
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
    const button = screen.getByRole('button', { name: '言語の切り替え' });
    expect(button).toBeInTheDocument();
  });

  it('クリックすると言語リストが表示される（DropdownMenuの挙動確認）', async () => {
    render(<LanguageToggle />);
    const button = screen.getByRole('button', { name: '言語 of 選択' }); // Radix UI のデフォルト挙動やaria-labelに依存
    // 実際には Header で LanguageToggle コンポーネント内の aria-label="言語の切り替え" を探す
    const toggleButton = screen.getByLabelText('言語の切り替え');

    fireEvent.click(toggleButton);

    // MenuItem が表示されるか確認（日本語/Englishなど）
    expect(await screen.findByText('日本語')).toBeInTheDocument();
    expect(await screen.findByText('English')).toBeInTheDocument();
  });
});
