/** @vitest-environment happy-dom */
import { useSession } from '@/lib/auth-client';
import { useAppAuth } from '@/hooks/use-app-auth';
import { useRouter } from 'next/navigation';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AuthButton } from './auth-button';

// mock router for stop trial test
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// better-authモック
vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(),
}));

// hook mock (we will override in individual tests as needed)
vi.mock('@/hooks/use-app-auth', () => ({
  useAppAuth: vi.fn(),
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
    // default hook return
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: false,
      isTrialMode: false,
      isPending: false,
      userName: '',
    } as any);
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
    expect(link).toHaveAttribute('href', '/login');

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

    // ensure hook reflects authenticated state
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: true,
      isTrialMode: false,
      isPending: false,
      userName: 'Test User',
    } as any);

    const { container } = render(<AuthButton />);
    const link = screen.getByRole('link', { name: 'ダッシュボードへ移動' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');

    // a11yチェック
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('お試しモード時はお試し中表示と終了ボタンが表示され、終了すると localStorage がクリアされる', async () => {
    // create mock router functions
    const pushMock = vi.fn();
    const refreshMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: pushMock, refresh: refreshMock } as any);

    // simulate trial mode
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: true,
      isTrialMode: true,
      isPending: false,
      userName: 'お試しユーザー',
    } as any);

    render(<AuthButton />);

    const trialLabel = screen.getByText('お試し中');
    expect(trialLabel).toBeInTheDocument();

    const stopButton = screen.getByRole('button', { name: '体験をやめる' });
    expect(stopButton).toBeInTheDocument();

    // set localStorage to simulate existing trial data/flag
    localStorage.setItem('vns_trial_mode', 'true');
    localStorage.setItem('vns_trial_data', JSON.stringify({ foo: 'bar' }));

    // click stop
    fireEvent.click(stopButton);

    // ensure storage cleaned and router invoked
    expect(localStorage.getItem('vns_trial_mode')).toBeNull();
    expect(localStorage.getItem('vns_trial_data')).toBeNull();
    expect(pushMock).toHaveBeenCalledWith('/');
    expect(refreshMock).toHaveBeenCalled();
  });
});
