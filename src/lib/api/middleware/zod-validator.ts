import { Context, MiddlewareHandler } from 'hono';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';

/**
 * Custom Zod validator middleware for Hono
 * Validates request body/query params and attaches to context
 */
export function zodValidator<T extends z.ZodSchema>(
  target: 'json' | 'query' | 'param',
  schema: T
): MiddlewareHandler {
  return async (c: Context, next) => {
    try {
      let data: unknown;

      switch (target) {
        case 'json':
          data = await c.req.json();
          break;
        case 'query':
          data = c.req.query();
          break;
        case 'param':
          data = c.req.param();
          break;
        default:
          throw new Error(`Unknown validation target: ${target}`);
      }

      // Validate using Zod
      const validated = schema.parse(data);

      // Attach validated data to context
      // Store validated data in a map by target type
      if (!(c.req as any)._validatedData) {
        (c.req as any)._validatedData = new Map();
      }
      (c.req as any)._validatedData.set(target, validated);

      // Define the valid function to retrieve validated data
      (c.req as any).valid = (t: string) => {
        return (c.req as any)._validatedData?.get(t);
      };

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formatted = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        throw new HTTPException(400, {
          message: 'Validation error',
          res: new Response(
            JSON.stringify({
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Request validation failed',
                details: formatted,
              },
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          ),
        });
      }

      throw error;
    }
  };
}

/**
 * Helper to retrieve validated data from context
 * Usage: const body = c.req.valid('json');
 */
declare global {
  namespace Hono {
    interface HonoRequest {
      valid(target: string): any;
    }
  }
}
