---
name: vitest-testing-strategies
description: Best practices for testing with Vitest and React Testing Library, focusing on stability, correct mocking, and integration testing patterns.
---

# Vitest Testing Strategies

This skill outlines strategies to write robust, non-flaky tests using Vitest, specifically resolving common issues with mocking and environment differences.

## 1. Mocking Strategies

### `vi.spyOn` vs `vi.mock`

- **Use `vi.spyOn`** when you need to mock a method on an _existing object_ (like `localStorage`, `window`, or a class instance) and want to restore it later.
- **Use `vi.mock`** when you need to replace an entire _module_ import.

### Mocking `localStorage`

Since `localStorage` is available in jsdom but sometimes needs explicit mocking for state verification:

```typescript
// Better than defining a mock object manually
const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

// Act
userEvent.click(button);

// Assert
expect(setItemSpy).toHaveBeenCalledWith('key', 'value');
```

## 2. Integration Testing Pattern (RGR + AAA)

Follow the **AAA** (Arrange, Act, Assert) pattern strictly.

```typescript
describe("Feature Integration", () => {
  it("should save data on submit", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<MyComponent />);

    // Act
    await user.type(screen.getByRole("textbox"), "Hello");
    await user.click(screen.getByRole("button", { name: "Save" }));

    // Assert
    expect(await screen.findByText("Success")).toBeInTheDocument();
  });
});
```

## 3. Handling External Dependencies (Supabase, etc.)

Avoid mocking internal implementation details. Mock at the boundaries.
For Supabase client component hooks:

```typescript
import * as SupabaseHooks from "@/lib/supabase/client";

// In test setup
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));
```

## 4. Common Issues & fixes

- **"Module not found" in mocks**: Ensure paths in `vi.mock` match the import paths exactly (aliases vs relative).
- **Hoisting**: `vi.mock` is hoisted. Variables used inside `vi.mock` implementations must be referenced carefully or defined inside the factory if they are not global.
- **Act warnings**: Ensure all async interactions (userEvent, revalidations) are awaited.

## 5. Accessibility Testing

Always include axe checks in component tests.

```typescript
import { axe } from "vitest-axe";

it("should have no violations", async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
