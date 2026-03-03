/** @vitest-environment happy-dom */
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LogoutButton } from './logout-button';

// mocks
vi.mock('@/lib/auth-client', () => ({
    signOut: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock('@/lib/trial-storage', () => ({
    TrialStorage: {
        clear: vi.fn(),
    },
}));

import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { TrialStorage } from '@/lib/trial-storage';

describe('LogoutButton (header)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('クリック時にTrialStorage.clear()とsignOut()が呼ばれ、ルーターで遷移すること', async () => {
        const pushMock = vi.fn();
        (useRouter as any).mockReturnValue({ push: pushMock });

        render(<LogoutButton />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(TrialStorage.clear).toHaveBeenCalled();
        expect(signOut).toHaveBeenCalled();
        // router push invoked with /login
        expect(pushMock).toHaveBeenCalledWith('/login');
    });
});
