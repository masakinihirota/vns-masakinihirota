import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TrialButton } from './trial-button';

// Mocks
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
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
    const button = screen.getByRole('button', { name: /お試し/ });
    expect(button).toBeInTheDocument();
  });

  it('ボタンが有効であること', () => {
    render(<TrialButton />);
    const button = screen.getByRole('button', { name: /お試し/ });
    expect(button).not.toHaveAttribute('disabled');
  });

  it('ボタンをクリックできること', () => {
    render(<TrialButton />);
    const button = screen.getByRole('button', { name: /お試し/ });
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
