import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TalesClairePage from '@/app/(public)/(static)/tales-claire/page';

vi.mock('@/components/landing-page', () => ({
    TalesClaireLP: () => <main aria-label="tales-claire-page">Mock TalesClaireLP</main>,
}));

describe('TalesClairePage Integration', () => {
    it('ページが TalesClaireLP を表示すること', () => {
        render(<TalesClairePage />);
        expect(screen.getByLabelText('tales-claire-page')).toBeInTheDocument();
    });
});
