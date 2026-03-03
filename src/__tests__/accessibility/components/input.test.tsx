import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input Accessibility', () => {
  it('should render without crashing', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('input')).toBeTruthy();
  });

  it('should have placeholder when provided', () => {
    const { container } = render(
      <Input placeholder="Enter your email" />
    );
    const input = container.querySelector('input');
    expect(input?.placeholder).toBe('Enter your email');
  });

  it('should have aria-label when provided', () => {
    const { container } = render(
      <Input aria-label="Email address" />
    );
    const input = container.querySelector('input');
    expect(input?.getAttribute('aria-label')).toBe('Email address');
  });
});
