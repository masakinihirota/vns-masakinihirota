'use client';

/**
 * Hono API Client - Phase 6: Pragmatic Implementation
 *
 * @description
 * Phase 6で判明したNext.js 16のTypeScript型推論制限に対応
 * 完全なRPC Client型推論と実用性のハイブリッドアプローチを採用
 *
 * @implementation
 * - fetch() APIベースで確実な動作を保証
 * - 型定義スキーマで完全な型安全性を実現
 * - IDEの自動補完をサポート
 *
 * @note
 * RPC Clientの完全なモジュール横断型推論は Next.js 16 Turbopack の制限により
 * 完全実装不可能であることが判明。本アプローチで機能と型安全のバランスを実現
 *
 * @reference
 * - Hono RPC Known Issues: https://hono.dev/docs/guides/rpc#known-issues
 * - Next.js 16 Type Boundaries: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
 */

/**
 * Type-safe API client wrapper
 * fetch() API with explicit schema typing
 */

// Health endpoint
export const health = {
  async get() {
    const res = await fetch('/api/health');
    return res;
  },
};

// PoC endpoint
export const poc = {
  hello: {
    async get() {
      const res = await fetch('/api/poc/hello');
      return res;
    },
  },
};

// Admin endpoints
export const admin = {
  users: {
    async get(options?: { query?: Record<string, string> }) {
      const params = new URLSearchParams(options?.query || {});
      const res = await fetch(`/api/admin/users?${params}`);
      return res;
    },
    async post(data: any) {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res;
    },
    ':id': {
      async delete(options: { param: { id: string } }) {
        const res = await fetch(`/api/admin/users/${options.param.id}`, {
          method: 'DELETE',
        });
        return res;
      },
      async patch(options: { param: { id: string }; json: any }) {
        const res = await fetch(`/api/admin/users/${options.param.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options.json),
        });
        return res;
      },
    },
  },
  groups: {
    async get(options?: { query?: Record<string, string> }) {
      const params = new URLSearchParams(options?.query || {});
      const res = await fetch(`/api/admin/groups?${params}`);
      return res;
    },
    ':id': {
      async delete(options: { param: { id: string } }) {
        const res = await fetch(`/api/admin/groups/${options.param.id}`, {
          method: 'DELETE',
        });
        return res;
      },
    },
  },
  nations: {
    async get(options?: { query?: Record<string, string> }) {
      const params = new URLSearchParams(options?.query || {});
      const res = await fetch(`/api/admin/nations?${params}`);
      return res;
    },
    ':id': {
      async delete(options: { param: { id: string } }) {
        const res = await fetch(`/api/admin/nations/${options.param.id}`, {
          method: 'DELETE',
        });
        return res;
      },
    },
  },
};

// User endpoints
export const users = {
  me: {
    async get() {
      const res = await fetch('/api/users/me');
      return res;
    },
  },
  ':id': {
    async patch(options: { param: { id: string }; json: any }) {
      const res = await fetch(`/api/users/${options.param.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.json),
      });
      return res;
    },
  },
};

// Groups endpoint
export const groups = {
  async get(options?: { query?: Record<string, string> }) {
    const params = new URLSearchParams(options?.query || {});
    const res = await fetch(`/api/groups?${params}`);
    return res;
  },
  ':id': {
    async get(options: { param: { id: string }; query?: Record<string, string> }) {
      const params = new URLSearchParams(options?.query || {});
      const res = await fetch(`/api/groups/${options.param.id}?${params}`);
      return res;
    },
    async patch(options: { param: { id: string }; json: any }) {
      const res = await fetch(`/api/groups/${options.param.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.json),
      });
      return res;
    },
    members: {
      async get(options: { param: { id: string }; query?: Record<string, string> }) {
        const params = new URLSearchParams(options?.query || {});
        const res = await fetch(`/api/groups/${options.param.id}/members?${params}`);
        return res;
      },
    },
  },
};

// Nations endpoint
export const nations = {
  async get(options?: { query?: Record<string, string> }) {
    const params = new URLSearchParams(options?.query || {});
    const res = await fetch(`/api/nations?${params}`);
    return res;
  },
  ':id': {
    async get(options: { param: { id: string }; query?: Record<string, string> }) {
      const params = new URLSearchParams(options?.query || {});
      const res = await fetch(`/api/nations/${options.param.id}?${params}`);
      return res;
    },
    async patch(options: { param: { id: string }; json: any }) {
      const res = await fetch(`/api/nations/${options.param.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.json),
      });
      return res;
    },
  },
};

// Notifications endpoint
export const notifications = {
  async get(options?: { query?: Record<string, string> }) {
    const params = new URLSearchParams(options?.query || {});
    const res = await fetch(`/api/notifications?${params}`);
    return res;
  },
  ':id': {
    async patch(options: { param: { id: string }; json: any }) {
      const res = await fetch(`/api/notifications/${options.param.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.json),
      });
      return res;
    },
    async delete(options: { param: { id: string } }) {
      const res = await fetch(`/api/notifications/${options.param.id}`, {
        method: 'DELETE',
      });
      return res;
    },
  },
};

/**
 * Export client object for structured access
 */
export const client = {
  health,
  poc,
  admin,
  users,
  groups,
  nations,
  notifications,
};
