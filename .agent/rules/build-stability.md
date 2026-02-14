# Build Stability Rules

## Prevent Missing Module Errors

- **Verify file existence:** Before adding an import statement, explicitly ensure that the target file exists in the codebase.
- **Check build before completion:** Always run a build check (e.g., `npm run build` or `next build`) before marking a task as complete or requesting review. This ensures all dependencies are resolved.
- **Scaffold dependencies first:** When implementing a feature that relies on new files (such as `actions.ts` for server actions), create these dependency files _before_ or _immediately after_ adding the import references in other components.
