/**
 * RBAC Input Validation Tests
 *
 * @description
 * RBAC入力検証のテスト
 * - 不正なUUID形式の拒否
 * - SQLインジェクション試行の拒否
 * - 空文字・NULL・undefinedの拒否
 * - 特殊文字のサニタイズ
 */

import { describe, it, expect } from 'vitest';
import {
  validateUUID,
  validateAuthUserId,
  validateRole,
  validateUUIDs,
  RBACValidationError,
} from '../rbac-validation';

describe('RBAC Input Validation', () => {
  describe('validateUUID', () => {
    it('正常なUUID v4を受け入れる', () => {
      const validUUID = '123e4567-e89b-42d3-a456-426614174000';
      expect(validateUUID(validUUID, 'testId')).toBe(validUUID);
    });

    it('UUID v4以外を拒否する（v1, v3, v5）', () => {
      const uuidV1 = '123e4567-e89b-12d3-a456-426614174000'; // v1: 3rd group starts with 1
      expect(() => validateUUID(uuidV1, 'testId')).toThrow(RBACValidationError);
      expect(() => validateUUID(uuidV1, 'testId')).toThrow('must be a valid UUID v4');
    });

    it('空文字を拒否する', () => {
      expect(() => validateUUID('', 'testId')).toThrow(RBACValidationError);
      expect(() => validateUUID('', 'testId')).toThrow('cannot be empty');
    });

    it('NULL・undefinedを拒否する', () => {
      expect(() => validateUUID(null, 'testId')).toThrow(RBACValidationError);
      expect(() => validateUUID(undefined, 'testId')).toThrow(RBACValidationError);
    });

    it('数値型を拒否する', () => {
      expect(() => validateUUID(12345, 'testId')).toThrow(RBACValidationError);
      expect(() => validateUUID(12345, 'testId')).toThrow('must be a string');
    });

    it('SQLインジェクション試行を拒否する', () => {
      const sqlInjection = "123e4567-e89b-42d3-a456-426614174000'; DROP TABLE users; --";
      expect(() => validateUUID(sqlInjection, 'testId')).toThrow(RBACValidationError);
    });

    it('不正な形式のUUIDを拒否する', () => {
      const invalidFormats = [
        '123e4567-e89b-42d3-a456-42661417400', // 短い
        '123e4567-e89b-42d3-a456-4266141740000', // 長い
        '123e4567e89b42d3a456426614174000', // ハイフンなし
        'not-a-uuid-at-all',
        '123e4567-e89b-42d3-a456-42661417400g', // 不正な文字
      ];

      invalidFormats.forEach((invalid) => {
        expect(() => validateUUID(invalid, 'testId')).toThrow(RBACValidationError);
      });
    });

    it('大文字・小文字を区別しない（両方受け入れる）', () => {
      const lowercase = '123e4567-e89b-42d3-a456-426614174000';
      const uppercase = '123E4567-E89B-42D3-A456-426614174000';

      expect(validateUUID(lowercase, 'testId')).toBe(lowercase);
      expect(validateUUID(uppercase, 'testId')).toBe(uppercase);
    });
  });

  describe('validateAuthUserId', () => {
    it('正常なAuth User IDを受け入れる', () => {
      const validIds = [
        'user_123',
        'user-456',
        'abc123DEF',
        'a',
        '1234567890123456789012345678901234567890123456789012345678901234', // 64文字
      ];

      validIds.forEach((id) => {
        expect(validateAuthUserId(id, 'userId')).toBe(id);
      });
    });

    it('65文字以上を拒否する', () => {
      const tooLong = '12345678901234567890123456789012345678901234567890123456789012345'; // 65文字
      expect(() => validateAuthUserId(tooLong, 'userId')).toThrow(RBACValidationError);
      expect(() => validateAuthUserId(tooLong, 'userId')).toThrow('invalid characters');
    });

    it('空文字を拒否する', () => {
      expect(() => validateAuthUserId('', 'userId')).toThrow(RBACValidationError);
      expect(() => validateAuthUserId('', 'userId')).toThrow('cannot be empty');
    });

    it('特殊文字を拒否する', () => {
      const invalidChars = [
        'user@123',
        'user#123',
        'user$123',
        'user%123',
        'user&123',
        'user*123',
        'user(123',
        'user)123',
        'user+123',
        'user=123',
        'user[123',
        'user]123',
        'user{123',
        'user}123',
        'user|123',
        'user\\123',
        'user/123',
        'user?123',
        'user<123',
        'user>123',
        'user,123',
        'user.123',
        'user:123',
        'user;123',
        "user'123",
        'user"123',
        'user`123',
        'user~123',
        'user!123',
        'user 123', // スペース
      ];

      invalidChars.forEach((invalid) => {
        expect(() => validateAuthUserId(invalid, 'userId')).toThrow(RBACValidationError);
      });
    });

    it('SQLインジェクション試行を拒否する', () => {
      const sqlInjection = "admin' OR '1'='1";
      expect(() => validateAuthUserId(sqlInjection, 'userId')).toThrow(RBACValidationError);
    });

    it('XSS試行を拒否する', () => {
      const xss = '<script>alert("xss")</script>';
      expect(() => validateAuthUserId(xss, 'userId')).toThrow(RBACValidationError);
    });
  });

  describe('validateRole', () => {
    const allowedRoles = ['leader', 'member', 'admin', 'mediator'] as const;

    it('許可されたロールを受け入れる', () => {
      allowedRoles.forEach((role) => {
        expect(validateRole(role, allowedRoles, 'role')).toBe(role);
      });
    });

    it('許可されていないロールを拒否する', () => {
      const invalidRoles = ['guest', 'owner', 'superadmin', '', 'LEADER'];

      invalidRoles.forEach((role) => {
        expect(() => validateRole(role, allowedRoles, 'role')).toThrow(RBACValidationError);
      });
    });

    it('数値型を拒否する', () => {
      expect(() => validateRole(123, allowedRoles, 'role')).toThrow(RBACValidationError);
    });
  });

  describe('validateUUIDs', () => {
    it('正常なUUID配列を受け入れる', () => {
      const validUUIDs = [
        '123e4567-e89b-42d3-a456-426614174000',
        '223e4567-e89b-42d3-a456-426614174000',
        '323e4567-e89b-42d3-a456-426614174000',
      ];

      const result = validateUUIDs(validUUIDs, 'ids');
      expect(result).toEqual(validUUIDs);
    });

    it('配列でない値を拒否する', () => {
      expect(() => validateUUIDs('not-an-array' as any, 'ids')).toThrow(RBACValidationError);
      expect(() => validateUUIDs(null as any, 'ids')).toThrow(RBACValidationError);
    });

    it('空配列を拒否する', () => {
      expect(() => validateUUIDs([], 'ids')).toThrow(RBACValidationError);
      expect(() => validateUUIDs([], 'ids')).toThrow('cannot be empty');
    });

    it('101個以上の要素を拒否する（DoS攻撃防止）', () => {
      const tooMany = Array(101).fill('123e4567-e89b-42d3-a456-426614174000');
      expect(() => validateUUIDs(tooMany, 'ids')).toThrow(RBACValidationError);
      expect(() => validateUUIDs(tooMany, 'ids')).toThrow('cannot exceed 100 items');
    });

    it('100個の要素は受け入れる', () => {
      const exactly100 = Array(100).fill('123e4567-e89b-42d3-a456-426614174000');
      const result = validateUUIDs(exactly100, 'ids');
      expect(result).toHaveLength(100);
    });

    it('配列内の不正なUUIDを拒否する', () => {
      const mixedUUIDs = [
        '123e4567-e89b-42d3-a456-426614174000',
        'invalid-uuid',
        '323e4567-e89b-42d3-a456-426614174000',
      ];

      expect(() => validateUUIDs(mixedUUIDs, 'ids')).toThrow(RBACValidationError);
    });
  });

  describe('RBACValidationError', () => {
    it('正しいエラー情報を保持する', () => {
      const error = new RBACValidationError(
        'Invalid UUID format',
        'groupId',
        'not-a-uuid'
      );

      expect(error.message).toBe('Invalid UUID format');
      expect(error.field).toBe('groupId');
      expect(error.value).toBe('not-a-uuid');
      expect(error.name).toBe('RBACValidationError');
    });

    it('エラーインスタンスとして識別可能', () => {
      const error = new RBACValidationError('test', 'field', 'value');
      expect(error instanceof Error).toBe(true);
      expect(error instanceof RBACValidationError).toBe(true);
    });
  });
});
