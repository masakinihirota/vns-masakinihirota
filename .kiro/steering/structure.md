# Project Structure

## 1. Root Directory Organization

The root directory contains configuration files, documentation, and the main source code folder (`src`).

| Path | Description |
|---|---|
| `src/` | Main application source code. |
| `drizzle/` | Drizzle ORM schema, migration files, and seeds. |
| `supabase/` | Supabase project configuration and migrations. |
| `.github/` | GitHub-specific files, including workflows, issue templates, and AI instructions. |
| `.kiro/` | Steering and specification files for AI-driven development. |
| `public/` | Static assets like images and fonts. |
| `scripts/` | Automation and utility scripts. |
| `package.json` | Project dependencies and scripts. |
| `next.config.ts`| Next.js configuration file. |
| `tsconfig.json` | TypeScript configuration. |
| `biome.jsonc` | Biome linter/formatter configuration. |

## 2. Subdirectory Structures (`src`)

The `src` directory is organized by feature and type.

| Path | Description |
|---|---|
| `src/app/` | Contains all routes, pages, and layouts, following the Next.js App Router convention. |
| `src/components/` | Shared UI components, including `shadcn/ui` components and custom-built ones. |
| `src/hooks/` | Custom React hooks for shared logic. |
| `src/lib/` | Core library functions, utilities, and Supabase client initializations. |
| `src/modules/` | Contains larger, feature-specific modules that may include components, hooks, and lib functions. |
| `src/types/` | Global TypeScript type definitions. |
| `src/middleware.ts` | Next.js middleware for handling requests, primarily for session management with Supabase. |

## 3. Code Organization Patterns

- **Feature-based structure**: Code is organized around features within the `src/modules` directory.
- **Component Colocation**: Components specific to a certain route are often located within the corresponding `src/app/path/` directory.
- **Server and Client Separation**: Supabase clients are separated for server-side (`lib/supabase/server.ts`) and client-side usage to manage authentication state correctly.

## 4. File Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Pages/Layouts**: `page.tsx`, `layout.tsx` (Next.js convention)
- **Styles/Types**: kebab-case (`-` separated) or snake_case (`_` separated) may be used. Consistency within a module is key.
- **Tests**: `*.test.ts` or `*.spec.ts` (Vitest is planned).

## 5. Import Organization

- **Path Aliases**: The project uses the `@/*` alias, configured in `tsconfig.json`, to map to the `src/` directory for cleaner, absolute imports.
- **Auto-sorting**: Biome is configured to automatically sort imports, ensuring consistency.

## 6. Key Architectural Principles

- **Spec-Driven Development**: Development follows a formal process of writing specifications before implementation, guided by AI tools as defined in `gemini.md`.
- **Type Safety End-to-End**: TypeScript is used throughout the stack, from database schema (Drizzle) to UI components.
- **Separation of Concerns**: The codebase separates UI (`components`), business logic (`lib`, `hooks`, `modules`), and routing (`app`).
- **Declarative Database Schema**: The database schema is managed declaratively using Drizzle ORM schema files, with migrations generated from them.
