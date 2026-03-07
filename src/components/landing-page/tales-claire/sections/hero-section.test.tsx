import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { HeroSection } from './hero-section';

vi.mock('@/components/concept-explanation', () => ({
    ConceptExplanationContainer: () => (
        <div aria-label="concept-explanation">Mock Concept Explanation</div>
    ),
}));

describe('HeroSection', () => {
    it('主要コピーが表示されること', () => {
        render(<HeroSection />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('VNS');
        expect(screen.getByText(/masakinihirota/)).toBeInTheDocument();
        expect(screen.getByText(/昨日僕が感動した作品を/)).toBeInTheDocument();
        expect(screen.getByLabelText('concept-explanation')).toBeInTheDocument();
    });

    it('アクセシビリティ違反がないこと', async () => {
        const { container } = render(<HeroSection />);
        const results = await axe(container);
        expect(results.violations).toHaveLength(0);
    });
});
