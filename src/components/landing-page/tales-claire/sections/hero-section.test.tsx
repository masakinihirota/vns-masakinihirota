import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { HeroSection } from './hero-section';

describe('HeroSection', () => {
    it('主要コピーが表示されること', () => {
        render(<HeroSection />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('VNS');
        expect(screen.getByText(/masakinihirota/)).toBeInTheDocument();
    });

    it('アクセシビリティ違反がないこと', async () => {
        const { container } = render(<HeroSection />);
        const results = await axe(container);
        expect(results.violations).toHaveLength(0);
    });
});
