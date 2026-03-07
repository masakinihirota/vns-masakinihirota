import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PurposeSection } from './purpose-section';

describe('PurposeSection', () => {
    it('機能一覧の主要文言が表示されること', () => {
        render(<PurposeSection />);

        expect(screen.getByText('masakinihirotaの主な機能')).toBeInTheDocument();
        expect(screen.getByText('安心で安全な場所を提供する')).toBeInTheDocument();
        expect(
            screen.getByText('スキルを登録して仕事を獲得したり、他者に教えたりする')
        ).toBeInTheDocument();
    });

    it('アクセシビリティ違反がないこと', async () => {
        const { container } = render(<PurposeSection />);
        const results = await axe(container);
        expect(results.violations).toHaveLength(0);
    });
});
