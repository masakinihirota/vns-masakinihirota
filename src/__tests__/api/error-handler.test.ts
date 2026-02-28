/**
 * Hono API - Error Handler Test
 *
 * @description
 * - vitest + hono/testing でのエラーハンドラーテスト
 * - Database 依存なしの単純なミドルウェアテスト
 */

import { describe, it, expect } from 'vitest';
import { testClient } from 'hono/testing';
import { Hono } from 'hono';
import { errorHandler } from '@/lib/api/middleware/error-handler';

describe('[Unit] Error Handler Middleware', () => {
  it('should return 404 with NOT_FOUND error', async () => {
    const app = new Hono();
    app.onError(errorHandler);

    app.get('/test', (c) => {
      const error = new Error('Not found') as any;
      error.code = 'NOT_FOUND';
      error.message = 'Resource not found';
      throw error;
    });

    const res = await testClient(app).test.$get();
    expect(res.status).toBe(404);

    const data = (await res.json()) as any;
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('NOT_FOUND');
  });

  it('should return 400 with VALIDATION_ERROR', async () => {
    const app = new Hono();
    app.onError(errorHandler);

    app.post('/test', (c) => {
      const error = new Error('Invalid data') as any;
      error.code = 'VALIDATION_ERROR';
      error.details = { field: 'email', issue: 'Invalid format' };
      throw error;
    });

    const res = await testClient(app).test.$post();
    expect(res.status).toBe(400);

    const data = (await res.json()) as any;
    expect(data.error.code).toBe('VALIDATION_ERROR');
    expect(data.error.details.field).toBe('email');
  });

  it('should return 500 for unexpected errors', async () => {
    const app = new Hono();
    app.onError(errorHandler);

    app.get('/test', (c) => {
      throw new Error('Unexpected error');
    });

    const res = await testClient(app).test.$get();
    expect(res.status).toBe(500);

    const data = (await res.json()) as any;
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('INTERNAL_ERROR');
  });
});

describe('[Integration] Basic Health Check', () => {
  it('should respond to health check', async () => {
    const app = new Hono();

    app.get('/health', (c) => {
      return c.json({
        success: true,
        data: {
          status: 'ok',
          timestamp: Date.now(),
          version: '1.0.0',
        },
      });
    });

    const res = await testClient(app).health.$get();
    expect(res.status).toBe(200);

    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('ok');
  });
});
