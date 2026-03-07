import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { LandingPage } from './tales-claire-lp';

vi.mock('@/components/trial-entry', () => ({
    TrialEntrySection: () => <section aria-label="trial-entry">Mock Trial Entry</section>,
}));

vi.mock('./sections/inspiration-section', () => ({
    InspirationSection: () => <section aria-label="inspiration">Mock Inspiration</section>,
}));

vi.mock('./sections/identity-section', () => ({
    IdentitySection: () => <section aria-label="identity">Mock Identity</section>,
}));

describe('LandingPage', () => {
    it('主要セクションが描画されること', async () => {
        render(<LandingPage />);

        expect(screen.getByText('Value Network Service')).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /^VNS\s+masakinihirota$/i })
        ).toBeInTheDocument();
        expect(screen.getByText('masakinihirotaの主な機能')).toBeInTheDocument();
        expect(screen.getByText('サイトの目的')).toBeInTheDocument();
        expect(screen.getByLabelText('trial-entry')).toBeInTheDocument();
        expect(await screen.findByLabelText('inspiration')).toBeInTheDocument();
        expect(await screen.findByLabelText('identity')).toBeInTheDocument();
    });

    it('アクセシビリティ違反がないこと', async () => {
        const { container } = render(<LandingPage />);
        const results = await axe(container);
        expect(results.violations).toHaveLength(0);
    });
});
