
import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from './page';
import '@testing-library/jest-dom';

describe('Page', () => {
    it('HOMEのページが表示される', () => {
        render(<Page />);
        expect(screen.getByText('■HOMEのページ')).toBeInTheDocument();
        expect(screen.getByText('Sampleページへ')).toBeInTheDocument();
    });
});
