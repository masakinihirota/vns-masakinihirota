import { describe, expect, it } from 'vitest';
import { MY_PROFILES } from './work-profile-comparison.logic';

describe('Import Debug Test', () => {
  it('MY_PROFILES should be defined', () => {
    expect(MY_PROFILES).toBeDefined();
    expect(MY_PROFILES.length).toBeGreaterThan(0);
    console.log('MY_PROFILES:', MY_PROFILES[0].name);
  });
});
