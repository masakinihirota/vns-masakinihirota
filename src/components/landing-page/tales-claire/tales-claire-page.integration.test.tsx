import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LandingPageByTalesClaireRoute from '@/app/(public)/(static)/tales-claire/page';

vi.mock('@/components/landing-page', () => ({
    LandingPage: () => <main aria-label="landing-page">Mock LandingPage</main>,
}));

describe('LandingPageByTalesClaireRoute Integration', () => {
    it('ページが LandingPage を表示すること', () => {
        render(<LandingPageByTalesClaireRoute />);
        expect(screen.getByLabelText('landing-page')).toBeInTheDocument();
    });
});
