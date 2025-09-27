# Product Overview

## 1. Product Description

This project, `vns-masakinihirota`, is the core web application for the "masakinihirota" service. It is part of a larger workspace that includes separate repositories for design (`vns-masakinihirota-design`) and documentation (`vns-masakinihirota-doc`). The application provides users with features related to social authentication and other core functionalities of the VNS platform.

## 2. Core Features

Based on the project documentation and dependencies, the core features include:
- **User Authentication**: Supports social login via Google and GitHub, as well as anonymous login for initial user experience.
- **Session Management**: Handles user sessions across the application using Supabase Auth helpers for SSR and middleware.
- **Database Interaction**: Utilizes Drizzle ORM for type-safe access to a Postgres database managed by Supabase.
- **Internationalization (i18n)**: Supports multiple languages through the `next-intl` library.
- **Modern UI**: Built with `shadcn/ui`, Radix UI, and Tailwind CSS for a flexible and modern user interface.

## 3. Target Use Case

The application is designed for users who need to interact with the masakinihirota platform. The initial focus is on providing a seamless and secure authentication experience, which serves as the foundation for future features like user profiles and platform-specific interactions.

## 4. Key Value Proposition

- **Type-Safety**: Leverages TypeScript in strict mode and Drizzle ORM to ensure type safety from the database to the frontend.
- **Modern Tech Stack**: Utilizes the latest features of Next.js 15 (App Router) and React 19, ensuring a high-performance and maintainable codebase.
- **Integrated Development Workflow**: Employs a spec-driven development process with AI assistance (Gemini/Kiro), structured task management, and automated code quality checks with Biome and Husky.
- **Scalable Architecture**: Built on Supabase, providing a scalable backend for authentication, database, and storage needs.
