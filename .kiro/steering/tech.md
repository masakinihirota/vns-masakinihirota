# Technology Stack

## 1. Architecture

This project is a modern full-stack web application built with Next.js (App Router). It follows a monolithic repository structure for the core application code, while design and documentation are managed in separate repositories. The backend services (authentication, database, storage) are provided by Supabase.

## 2. Frontend

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **UI Components**: `shadcn/ui` built on top of Radix UI.
- **Styling**: Tailwind CSS v4
- **Internationalization**: `next-intl`
- **Forms**: `@conform-to/react` and `@conform-to/zod` for type-safe forms.
- **Animations**: `framer-motion`

## 3. Backend

- **Platform**: Supabase
- **Database**: Postgres
- **ORM**: Drizzle ORM for type-safe database access.
- **Authentication**: Supabase Auth (supports OAuth with Google/GitHub and anonymous login).
- **Server Environment**: Next.js API Routes, Server Actions, and Edge Functions.

## 4. Development Environment

- **Package Manager**: pnpm
- **Node.js**: Recommended version 20.x LTS
- **Code Quality**:
  - **Linter/Formatter**: BiomeJS (`biome.jsonc`)
  - **Git Hooks**: Husky and `lint-staged` for pre-commit checks.
- **Local Database Management**: Supabase CLI (optional) and Drizzle Kit for schema migrations.

## 5. Common Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server with Turbopack. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Start the production server. |
| `pnpm lint` | Run the linter (Biome). |
| `pnpm format` | Format the code (Biome). |
| `pnpm check` | Run both linter and formatter (Biome). |
| `pnpm db:generate` | Generate SQL migration files from Drizzle schema changes. |
| `pnpm db:migrate` | Apply generated migrations to the database. |
| `pnpm db:studio` | Launch Drizzle Studio to browse the database. |

## 6. Environment Variables

The application requires Supabase credentials to be set in an `.env.local` file.

```
# Publicly available on the client
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Server-side only. Do not expose to the client.
SUPABASE_SERVICE_ROLE_KEY=...
```

## 7. Port Configuration

- **Development Server**: `http://localhost:3000` (default for Next.js)
