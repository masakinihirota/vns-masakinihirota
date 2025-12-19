/* eslint-disable @typescript-eslint/no-explicit-any */
// Local module fallbacks for packages without TypeScript types
// Add more `declare module` lines as needed when tsc complains about missing types

declare module "hono";
declare module "hono/vercel";

declare module "@hookform/resolvers/zod" {
  export function zodResolver(schema: any): any;
}

// Vitest globals (test environment)
declare const beforeAll: (fn: () => any) => void;
declare const afterAll: (fn: () => any) => void;
declare const beforeEach: (fn: () => any) => void;
declare const afterEach: (fn: () => any) => void;
declare const describe: any;
declare const it: any;
declare const test: any;
declare const expect: any;
declare const vi: any;

// If any other package reports 'Cannot find module', add it here
