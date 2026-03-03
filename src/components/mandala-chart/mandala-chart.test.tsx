import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { MandalaCell } from './mandala-cell/mandala-cell';
import { MandalaGrid } from './mandala-grid/mandala-grid';

describe('MandalaChart Accessibility', () => {
  it('MandalaCell should have no accessibility violations', async () => {
    const { container } = render(
      <MandalaCell
        value="Test Goal"
        cellIdx={4}
        gridIdx={4}
        onClick={() => { }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('MandalaGrid should have no accessibility violations', async () => {
    const data = Array(9).fill("Goal");
    const { container } = render(
      <MandalaGrid
        data={data}
        gridIdx={4}
        onCellClick={() => { }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
