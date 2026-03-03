import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Accessibility', () => {
  it('should render without crashing', () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should have aria-label when provided', () => {
    const { container } = render(
      <Button aria-label="Save changes">Save</Button>
    );
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Save changes');
  });

  it('should have disabled state', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
  });
});
