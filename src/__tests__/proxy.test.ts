import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { proxy } from '../proxy';

// Mock dependencies
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('@/config/routes', () => ({
  ROUTES: {
    LANDING: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    HOME: '/home',
    ADMIN: '/admin',
    TALES_CLAIRE: '/tales-claire',
    NATION_CREATE: '/nation/create',
  },
  PUBLIC_PATHS: ['/login', '/signup'],
  STATIC_PATHS: ['/', '/faq', '/help', '/tales-claire'],
}));

import { auth } from '@/lib/auth';
import { headers as getHeaders } from 'next/headers';

describe('proxy (Next.js 16 Middleware)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access to landing page for unauthenticated users', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue(null);

    const response = await proxy(request);

    expect(response.status).toBe(200);
  });

  it('should redirect authenticated users from /login to /home', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/login'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: '1', email: 'test@example.com', role: 'user' },
    });

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/home');
  });

  it('should redirect unauthenticated users from protected pages to /', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/protected'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue(null);

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/');
  });

  it('should allow access to /tales-claire for unauthenticated users', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/tales-claire'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue(null);

    const response = await proxy(request);

    expect(response.status).toBe(200);
  });

  it('should not treat /login-help as a public path', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/login-help'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue(null);

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/');
  });

  // RBAC tests removed - authorization is now handled in Server Actions, not in proxy
  // Proxy only handles authentication (session validity)
  // See: src/proxy.ts - "認可ロジック（ロール based アクセス制御）は Server Action で実施"

  it('should allow authenticated admin users to access /admin (RBAC check in Server Action)', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/admin'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: '1', email: 'admin@example.com', role: 'platform_admin' },
    });

    const response = await proxy(request);

    expect(response.status).toBe(200);
  });

  // RBAC check for /nation/create removed - handled in Server Action
  // Proxy only verifies authentication, not authorization

  it('should allow authenticated group_leader users to access /nation/create (RBAC check in Server Action)', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/nation/create'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: '1', email: 'leader@example.com', role: 'group_leader' },
    });

    const response = await proxy(request);

    expect(response.status).toBe(200);
  });

  it('should handle session retrieval errors gracefully', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/protected'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockRejectedValue(new Error('Network error'));

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/');
  });
});

