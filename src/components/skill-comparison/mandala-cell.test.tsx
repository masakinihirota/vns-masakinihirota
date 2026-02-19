import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { MandalaCell } from './mandala-cell';
import { MANDALA_STATUS } from './skill-comparison.logic';

describe('MandalaCell Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MandalaCell label="Test" status={MANDALA_STATUS.SYNC} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('MandalaCell', () => {
  it('CENTERセルの場合に正しいスタイルでレンダリングされる', () => {
    render(<MandalaCell label="Center Skill" isCenter={true} />);
    expect(screen.getByText('Center Skill')).toBeInTheDocument();
    expect(screen.getByTestId('mandala-cell-center')).toBeInTheDocument();
  });

  it('SYNC状態の場合にアイコンが表示される', () => {
    render(<MandalaCell label="Sync Skill" status={MANDALA_STATUS.SYNC} />);
    expect(screen.getByLabelText('Sync Mode')).toBeInTheDocument();
  });

  it('ADVICE状態の場合にアイコンが表示される', () => {
    render(<MandalaCell label="Advice Skill" status={MANDALA_STATUS.ADVICE} />);
    expect(screen.getByLabelText('Advice Mode')).toBeInTheDocument();
  });

  it('LEARN状態の場合にアイコンが表示される', () => {
    render(<MandalaCell label="Learn Skill" status={MANDALA_STATUS.LEARN} />);
    expect(screen.getByLabelText('Learning Mode')).toBeInTheDocument();
  });

  it('EMPTY状態の場合にラベルが表示される', () => {
    render(<MandalaCell label="Empty Skill" status={MANDALA_STATUS.EMPTY} />);
    expect(screen.getByText('Empty Skill')).toHaveClass('text-base');
  });
});
