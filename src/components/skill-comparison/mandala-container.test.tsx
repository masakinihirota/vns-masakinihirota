import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { MandalaContainer } from './mandala-container';

describe('MandalaContainer Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MandalaContainer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
