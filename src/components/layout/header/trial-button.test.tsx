/** @vitest-environment happy-dom */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TrialButton } from './trial-button';

// toast のモック
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('TrialButton Accessibility', () => {
  it('アクセシビリティ違反がないこと', async () => {
    const { container } = render(<TrialButton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('TrialButton Logic', () => {
  beforeEach(() => {
    // localStorage のモックリセット
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('初期状態はオフ（false）であること', () => {
    render(<TrialButton />);
    const toggle = screen.getByRole('switch', { name: 'お試しモードの切り替え' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('クリックするとオンになり、localStorageに保存されtoastが呼ばれること', async () => {
    render(<TrialButton />);
    const toggle = screen.getByRole('switch', { name: 'お試しモードの切り替え' });

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-checked', 'true');
      expect(toggle).toHaveAttribute('aria-pressed', 'true');
      expect(localStorage.getItem('vns_trial_mode')).toBe('true');
      expect(localStorage.getItem('vns_trial_dummy_data')).toBeDefined();
      expect(toast.success).toHaveBeenCalledWith(
        'お試しモードを開始しました',
        expect.any(Object)
      );
    });
  });

  it('localStorageエラー時に安全に劣化（Graceful Degradation）し、エラートーストが出ること', async () => {
    // setItem が例外を投げるようモック
    const setItemMock = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    render(<TrialButton />);
    const toggle = screen.getByRole('switch', { name: 'お試しモードの切り替え' });

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'お試し状態の保存に失敗しました',
        expect.any(Object)
      );
    });

    setItemMock.mockRestore();
  });
});
