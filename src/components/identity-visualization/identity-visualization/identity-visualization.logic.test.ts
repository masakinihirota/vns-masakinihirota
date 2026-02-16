import { describe, expect, it } from 'vitest';
import { calculateBezierPath, getProfileById, IDENTITY_CONFIG } from './identity-visualization.logic';

describe('identity-visualization.logic', () => {
  describe('getProfileById', () => {
    it('ghostを指定した場合、シュレディンガーちゃんのデータを返す', () => {
      const profile = getProfileById('ghost');
      expect(profile.id).toBe('ghost');
      expect(profile.name).toBe(IDENTITY_CONFIG.ghost.name);
    });

    it('存在するマスクIDを指定した場合、そのマスクのデータを返す', () => {
      const maskId = IDENTITY_CONFIG.masks[0].id;
      const profile = getProfileById(maskId);
      expect(profile.id).toBe(maskId);
      expect(profile.name).toBe(IDENTITY_CONFIG.masks[0].name);
    });

    it('存在しないIDを指定した場合、シュレディンガーちゃん（デフォルト）を返す', () => {
      const profile = getProfileById('invalid-id');
      expect(profile.id).toBe('ghost');
    });
  });

  describe('calculateBezierPath', () => {
    it('始点と終点から正しいベジェ曲線のパス文字列を生成する', () => {
      const x1 = 0, y1 = 0, x2 = 100, y2 = 100;
      const path = calculateBezierPath(x1, y1, x2, y2);
      // M 0 0 C 50 0 50 100 100 100
      expect(path).toBe('M 0 0 C 50 0 50 100 100 100');
    });

    it('座標が負の場合も正しく動作する', () => {
      const x1 = -10, y1 = -10, x2 = 10, y2 = 10;
      const path = calculateBezierPath(x1, y1, x2, y2);
      expect(path).toBe('M -10 -10 C 0 -10 0 10 10 10');
    });
  });
});
