/** @vitest-environment happy-dom */
import { useSession } from '@/lib/auth-client';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AuthButton } from './auth-button';

// better-authモック
vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(),
}));

// next/linkモック
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('AuthButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ローディング中はスピナーが表示され非活性', async () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      isPending: true,
      error: null
    } as any);

    const { container } = render(<AuthButton />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(screen.getByText('読み込み中')).toBeInTheDocument();

    // a11yチェック
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('未ログイン時はログイン画面へのリンクが表示される', async () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      isPending: false,
      error: null
    } as any);

    const { container } = render(<AuthButton />);
    const link = screen.getByRole('link', { name: 'ログイン画面へ移動' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/sign-in');

    // a11yチェック
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ログイン済みの場合はアカウントダッシュボードへのリンクが表示される', async () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: { id: 'test', name: 'Test User', email: 'test@example.com' },
        session: { id: 'session', userId: 'user', expiresAt: new Date() }
      },
      isPending: false,
      error: null
    } as any);

    const { container } = render(<AuthButton />);
    const link = screen.getByRole('link', { name: 'ダッシュボードへ移動' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');

    // a11yチェック
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
