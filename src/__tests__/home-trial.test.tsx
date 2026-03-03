/** @vitest-environment happy-dom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomeTrialPage from '@/app/(trial)/home-trial/page';
import { TrialStorage, generateRandomAnonymousName } from '@/lib/trial-storage';

// mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn() })
}));

beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('vns_trial_mode', 'true');
    vi.mocked(TrialStorage.load).mockReturnValue({
        points: { current: 2000 },
        rootAccount: null,
        groups: [],
        nation: null,
        watchlist: [],
        createdAt: new Date().toISOString()
    });
    vi.mocked(generateRandomAnonymousName).mockImplementation((sign?: string) => `テストの${sign || '星座'}`);
});

describe('HomeTrialPage constellation flow', () => {
    it('asks for constellation and then shows anonymous name', async () => {
        render(<HomeTrialPage />);
        expect(screen.getByText('あなたの星座は？')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: '牡羊座' });
        fireEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText(/テストの牡羊座/)).toBeInTheDocument();
            expect(screen.queryByText('あなたの星座は？')).toBeNull();
        });
    });
});
