/** @vitest-environment happy-dom */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TrialButton } from './trial-button';

// Mocks
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('TrialButton Accessibility', () => {
  it('無視不可なアクセシビリティ違反がないこと', async () => {
    const { container } = render(<TrialButton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('TrialButton Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('ボタンが表示されていること', () => {
    render(<TrialButton />);
    const button = screen.getByRole('button', { name: 'お試し体験' });
    expect(button).toBeInTheDocument();
  });

  it('ボタンをクリックするとランダム匿名名が生成されて localStorage に保存され、trial mode フラグが立つこと', async () => {
    render(<TrialButton />);
    const button = screen.getByRole('button', { name: 'お試し体験' });

    fireEvent.click(button);

    await waitFor(() => {
      const trialData = JSON.parse(localStorage.getItem('vns_trial_data') || '{}');
      expect(trialData.rootAccount).toBeDefined();
      expect(trialData.rootAccount.display_name).toBeDefined();
      // 星座匿名フォーマット: "色+マテリアル+の+星座" (例: 緑の光速の魚座)
      expect(trialData.rootAccount.display_name).toMatch(/^.+の.+座$/);
      expect(localStorage.getItem('vns_trial_mode')).toBe('true');
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('localStorage エラー時に安全に劣化してエラートーストが出ること', async () => {
    // setItem が例外を投げるようモック
    const setItemMock = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    render(<TrialButton />);
    const button = screen.getByRole('button', { name: 'お試し体験' });

    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'お試し開始に失敗しました',
        expect.any(Object)
      );
    });

    setItemMock.mockRestore();
  });
});
