import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AdsToggle } from './ads-toggle';

// sonner モック
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AdsToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('アクセシビリティ違反がないこと', async () => {
    const { container } = render(<AdsToggle />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('初期状態はオン（true）であること（デフォルト設定）', () => {
    render(<AdsToggle />);
    const toggle = screen.getByRole('switch', { name: '広告表示' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('クリックするとオフになりlocalStorageに保存される', async () => {
    render(<AdsToggle />);
    const toggle = screen.getByRole('switch', { name: '広告表示' });

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-checked', 'false');
      expect(localStorage.getItem('vns_ads_enabled')).toBe('false');
      expect(toast.success).toHaveBeenCalledWith('広告を無効化しました', expect.any(Object));
    });
  });
});
