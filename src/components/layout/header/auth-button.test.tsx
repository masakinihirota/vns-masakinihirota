/** @vitest-environment happy-dom */
import { useSession, signOut } from '@/lib/auth-client';
import { useAppAuth } from '@/hooks/use-app-auth';
import { useRouter } from 'next/navigation';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
// import { axe } from 'vitest-axe';  // TODO: happy-dom互換性問題により一時的に無効化
import { AuthButton } from './auth-button';
import { LocaleProvider } from '@/context/locale-context';
import React from 'react';

// Test helper: AuthButtonをLocaleProviderでラップ
const TestAuthButton = () => (
  <LocaleProvider>
    <AuthButton />
  </LocaleProvider>
);

// mock router for stop trial test
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// better-authモック
vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
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
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: false,
      isTrialMode: false,
      isPending: true,  // ローディング中
      userName: '',
    } as any);

    render(<TestAuthButton />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(screen.getByText('読み込み中')).toBeInTheDocument();

    // TODO: a11yチェック（happy-dom互換性問題により一時的に無効化）
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
  });

  it('未ログイン時はログイン画面へのリンクが表示される', async () => {
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: false,
      isTrialMode: false,
      isPending: false,
      userName: '',
    } as any);

    render(<TestAuthButton />);
    const link = screen.getByRole('link', { name: 'ログイン' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');

    // TODO: a11yチェック（happy-dom互換性問題により一時的に無効化）
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
  });

  it('ログイン済みの場合はアカウントリンクとログアウトボタンが表示される', async () => {
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

    render(<TestAuthButton />);
    const link = screen.getByRole('link', { name: 'ダッシュボードへ移動' });
    const logoutButton = screen.getByRole('button', { name: 'ログアウト' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
    expect(logoutButton).toBeInTheDocument();

    // TODO: a11yチェック（happy-dom互換性問題により一時的に無効化）
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
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

    render(<TestAuthButton />);

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

  it('ログアウトボタンをクリックするとログアウト処理が実行される', async () => {
    const pushMock = vi.fn();
    const refreshMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: pushMock, refresh: refreshMock } as any);

    // mock signOut
    vi.mocked(signOut).mockResolvedValue(undefined);

    // simulate authenticated state
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: true,
      isTrialMode: false,
      isPending: false,
      userName: 'Test User',
    } as any);

    render(<TestAuthButton />);

    const logoutButton = screen.getByRole('button', { name: 'ログアウト' });
    expect(logoutButton).toBeInTheDocument();

    // click logout
    fireEvent.click(logoutButton);

    // wait for async signOut to complete
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith('/');
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it('ログイン→ログアウト→ログインを繰り返しても状態が正常にリセットされる', async () => {
    const pushMock = vi.fn();
    const refreshMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: pushMock, refresh: refreshMock } as any);
    vi.mocked(signOut).mockResolvedValue(undefined);

    // 1. 初期状態: ログイン済み
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: true,
      isTrialMode: false,
      isPending: false,
      userName: 'Test User',
    } as any);

    const { rerender } = render(<TestAuthButton />);

    // 2. ログアウトボタンを見つけてクリック
    const logoutButton1 = screen.getAllByRole('button').find(btn => btn.textContent?.includes('ログアウト'));
    expect(logoutButton1).toBeDefined();
    fireEvent.click(logoutButton1!);

    // 3. ログアウト中の表示を確認
    await waitFor(() => {
      const loggingOutButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('ログアウト中'));
      expect(loggingOutButton).toBeDefined();
    });

    // 4. ログアウト成功後、未認証状態に
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: false,
      isTrialMode: false,
      isPending: false,
      userName: '',
    } as any);
    rerender(<TestAuthButton />);

    // 5. お試しボタンとログインリンクが表示される
    const trialButton = screen.getByRole('button', { name: 'お試し版を開始' });
    expect(trialButton).toBeInTheDocument();

    // 6. 再度ログイン（認証状態に戻る）
    vi.mocked(useAppAuth).mockReturnValue({
      isAuthenticated: true,
      isTrialMode: false,
      isPending: false,
      userName: 'Test User',
    } as any);
    rerender(<TestAuthButton />);

    // 7. 重要: 「ログアウト中...」ではなく「ログアウト」が表示される
    const logoutButton2 = screen.getAllByRole('button').find(btn =>
      btn.textContent === 'ログアウト' ||
      (btn.textContent?.includes('ログアウト') && !btn.textContent?.includes('ログアウト中'))
    );
    expect(logoutButton2).toBeDefined();
    expect(logoutButton2?.textContent).not.toContain('ログアウト中');

    // 8. 2回目のログアウトも正常に動作
    fireEvent.click(logoutButton2!);

    await waitFor(() => {
      const loggingOutButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('ログアウト中'));
      expect(loggingOutButton).toBeDefined();
    });
  });
});

