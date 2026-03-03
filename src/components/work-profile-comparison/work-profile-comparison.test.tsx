import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'vitest-axe';

// 1. Extend expect
expect.extend(toHaveNoViolations);

// 2. Mock lucide-react BEFORE other imports that might use it
vi.mock('lucide-react', () => ({
  ArrowRightLeft: () => React.createElement('div', { 'data-testid': 'icon-arrow' }),
  Clock: () => React.createElement('div', { 'data-testid': 'icon-clock' }),
  Filter: () => React.createElement('div', { 'data-testid': 'icon-filter' }),
  Flame: () => React.createElement('div', { 'data-testid': 'icon-flame' }),
  Layers: () => React.createElement('div', { 'data-testid': 'icon-layers' }),
  Link2: () => React.createElement('div', { 'data-testid': 'icon-link' }),
  Plus: () => React.createElement('div', { 'data-testid': 'icon-plus' }),
  Star: () => React.createElement('div', { 'data-testid': 'icon-star' }),
  UserCircle: () => React.createElement('div', { 'data-testid': 'icon-user' }),
  X: () => React.createElement('div', { 'data-testid': 'icon-x' }),
  BookOpen: () => React.createElement('div', { 'data-testid': 'icon-book' }),
  Clapperboard: () => React.createElement('div', { 'data-testid': 'icon-movie' }),
  History: () => React.createElement('div', { 'data-testid': 'icon-history' }),
  Activity: () => React.createElement('div', { 'data-testid': 'icon-activity' }),
  Zap: () => React.createElement('div', { 'data-testid': 'icon-zap' }),
}));

// 3. Import local modules
import { WorkProfileComparison } from './work-profile-comparison';
import { MY_PROFILES, generateComparisonData } from './work-profile-comparison.logic';

describe('WorkProfileComparison Accessibility', () => {
  const mockProps = {
    currentMe: MY_PROFILES[0],
    currentTarget: null,
    selectedMyId: MY_PROFILES[0].id,
    selectedTargetId: null,
    followedCandidates: [],
    watchedCandidates: [],
    queueCandidates: [],
    comparisonData: generateComparisonData(
      MY_PROFILES[0],
      null,
      {
        tier: { T1: true, T2: true, T3: true, NORMAL: true, UNRATED: true, INTERESTLESS: true },
        category: { MANGA: true, MOVIE: true, OTHER: true },
        temporal: { LIFE: true, PRESENT: true, FUTURE: true }
      },
      { key: 'heat', direction: 'desc' }
    ),
    syncLevel: null,
    lastLog: "READY",
    filters: {
      tier: { T1: true, T2: true, T3: true, NORMAL: true, UNRATED: true, INTERESTLESS: true },
      category: { MANGA: true, MOVIE: true, OTHER: true },
      temporal: { LIFE: true, PRESENT: true, FUTURE: true }
    },
    sortConfig: { key: 'heat' as const, direction: 'desc' as const },
    onSelectMyProfile: () => { },
    onSelectTarget: () => { },
    onToggleAction: () => { },
    onToggleTierFilter: () => { },
    onToggleCategoryFilter: () => { },
    onToggleTemporalFilter: () => { },
    onToggleSort: () => { },
  };

  it('should have no accessibility violations', async () => {
    const { container } = render(<WorkProfileComparison {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('名前が表示されていること', () => {
    render(<WorkProfileComparison {...mockProps} />);
    expect(screen.getByText(MY_PROFILES[0].name)).toBeInTheDocument();
  });
});
