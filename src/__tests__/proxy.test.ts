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
  },
  PUBLIC_PATHS: ['/login', '/signup'],
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

  it('should block non-admin users from /admin paths', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/admin'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: '1', email: 'user@example.com', role: 'user' },
    });

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/');
  });

  it('should allow admin users to access /admin', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/admin'));
    (getHeaders as any).mockResolvedValue({});
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
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

