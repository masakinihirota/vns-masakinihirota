import { z } from 'zod';

const rawEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
    BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_VERSION: z.string().optional(),
    USE_REAL_AUTH: z.enum(['true', 'false']).default('true'),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    TRUSTED_ORIGINS: z.string().optional(),
    CORS_ALLOWED_ORIGINS: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const mustConfigureOAuth = data.NODE_ENV === 'production' || data.USE_REAL_AUTH === 'true';

    if (mustConfigureOAuth) {
      if (!data.GOOGLE_CLIENT_ID) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['GOOGLE_CLIENT_ID'],
          message: 'GOOGLE_CLIENT_ID is required when OAuth is enabled',
        });
      }
      if (!data.GOOGLE_CLIENT_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['GOOGLE_CLIENT_SECRET'],
          message: 'GOOGLE_CLIENT_SECRET is required when OAuth is enabled',
        });
      }
      if (!data.GITHUB_CLIENT_ID) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['GITHUB_CLIENT_ID'],
          message: 'GITHUB_CLIENT_ID is required when OAuth is enabled',
        });
      }
      if (!data.GITHUB_CLIENT_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['GITHUB_CLIENT_SECRET'],
          message: 'GITHUB_CLIENT_SECRET is required when OAuth is enabled',
        });
      }
    }

    if (data.NODE_ENV === 'production') {
      if (!data.TRUSTED_ORIGINS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['TRUSTED_ORIGINS'],
          message: 'TRUSTED_ORIGINS is required in production',
        });
      }
      if (!data.CORS_ALLOWED_ORIGINS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['CORS_ALLOWED_ORIGINS'],
          message: 'CORS_ALLOWED_ORIGINS is required in production',
        });
      }
    }
  });

const parsedEnv = rawEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Environment validation failed:\n${issues}`);
}

const parseCsv = (value?: string): string[] =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const devDefaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

export const env = {
  ...parsedEnv.data,
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  useRealAuth: parsedEnv.data.USE_REAL_AUTH === 'true',
  trustedOrigins: Array.from(new Set([...parseCsv(parsedEnv.data.TRUSTED_ORIGINS), ...devDefaultOrigins])),
  corsAllowedOrigins: Array.from(
    new Set([
      ...parseCsv(parsedEnv.data.CORS_ALLOWED_ORIGINS),
      ...devDefaultOrigins,
      parsedEnv.data.NEXT_PUBLIC_APP_URL ?? '',
      parsedEnv.data.BETTER_AUTH_URL,
    ]).values()
  ).filter(Boolean),
};

export type Env = typeof env;
