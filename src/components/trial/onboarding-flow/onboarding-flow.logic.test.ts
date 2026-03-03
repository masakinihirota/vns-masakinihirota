/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOnboardingLogic } from './onboarding-flow.logic';

// localStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
vi.stubGlobal('localStorage', localStorageMock);

describe('useOnboardingLogic', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('初期状態が正しいこと', () => {
    const { result } = renderHook(() => useOnboardingLogic());
    expect(result.current.view).toBe('zodiac');
    expect(result.current.selectedZodiac).toBeNull();
    expect(result.current.confirmedName).toBeNull();
  });

  it('星座を選択すると generate 画面へ遷移し、名前候補が生成されること', () => {
    const { result } = renderHook(() => useOnboardingLogic());
    act(() => {
      result.current.handleSelectZodiac('獅子座');
    });
    expect(result.current.selectedZodiac).toBe('獅子座');
    expect(result.current.view).toBe('generate');
    expect(result.current.currentTrio.length).toBe(3);
  });

  it('名前を確定すると experience 画面へ遷移し、localStorage に保存されること', () => {
    const { result } = renderHook(() => useOnboardingLogic());
    act(() => {
      result.current.handleSelectZodiac('獅子座');
    });
    const candidate = result.current.currentTrio[0];
    act(() => {
      result.current.setTempSelectedName(candidate);
      result.current.handleFinalConfirm();
    });
    expect(result.current.confirmedName).toBe(candidate);
    expect(result.current.view).toBe('experience');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('リセットすると初期状態に戻ること', () => {
    const { result } = renderHook(() => useOnboardingLogic());
    act(() => {
      result.current.handleSelectZodiac('獅子座');
      result.current.reset();
    });
    expect(result.current.view).toBe('zodiac');
    expect(result.current.selectedZodiac).toBeNull();
  });
});
