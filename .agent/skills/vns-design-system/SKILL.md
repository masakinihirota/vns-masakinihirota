---
name: vns-design-system
description: Official design guidelines for VNS masakinihirota application, featuring Glassmorphism (Light) and Elegant (Dark) themes with high-contrast and readability standards.
---

# VNS Design System

This skill outlines the design standards for the VNS masakinihirota application. All UI implementation MUST adhere to these guidelines.

## 1. Core Principles

- **Theme Duality**:
  - **Light Mode**: "Clean Glassmorphism" - Soft gradients, high readability, airy feel.
  - **Dark Mode**: "Elegant Depth" - Deep backgrounds, subtle glows, sophisticated aesthetic.
- **Readability First**:
  - **Minimum Font Size**: **18px (`text-lg`)** for standard text.
  - **High Contrast**: Text must clearly stand out against backgrounds (WCAG AA compliant).
- **Semantic Colors**: Use `text-slate-900`/`800` for primary text in light mode, NEVER pure black or generic gray unless verified for contrast.

## 2. Typography Rules

### Font Sizes

- **Base/Body**: `text-lg` (18px) - _Default for all paragraphs, labels, and helper text._
  - _Do NOT use `text-xs`, `text-sm`, or `text-base` for ease of reading._
- **Headings**:
  - H1: `text-5xl md:text-7xl` (Hero)
  - H2: `text-2xl md:text-3xl`
  - H3: `text-xl md:text-2xl`
  - H4: `text-xl`

### Text Colors (Light Mode)

- **Primary Text**: `text-slate-900` or `text-foreground` (if sufficient contrast).
- **Secondary Text**: `text-slate-700` or `text-slate-600`.
- **Muted/Helper**: `text-slate-500` (Ensure contrast ratio > 4.5:1).
- **Links/Accents**: `text-indigo-600` or `text-blue-700`.

### Text Colors (Dark Mode)

- **Primary Text**: `text-white` or `text-foreground`.
- **Secondary Text**: `text-neutral-300` or `text-gray-300`.
- **Muted/Helper**: `text-muted-foreground` or `text-neutral-400`.
- **Accents**: `text-blue-100`, `text-emerald-100`.

## 3. Component Styles

### Backgrounds

- **Light Mode Global**: `bg-gradient-to-br from-blue-50 via-white to-purple-50`
- **Dark Mode Global**: Deep neutral or black (`bg-[#0a0a0a]`) with subtle nebula effects.

### Cards & Containers (Glassmorphism)

- **Light Mode**:

  ```tsx
  className="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm ring-1 ring-black/5"
  ```

  _Key features: High opacity (80%) for readability, distinct border._

- **Dark Mode**:
  ```tsx
  className="bg-white/5 backdrop-blur-lg border border-white/5 dark:shadow-none dark:ring-white/5"
  ```

### Buttons

#### "Trial / Local Mode" Button (Emerald)

Represents safety, entry, and local execution.

```tsx
className="bg-gradient-to-br from-emerald-100/50 to-teal-100/50 text-emerald-900 border border-emerald-500/30 hover:bg-emerald-100/80 hover:border-emerald-500/50 dark:from-emerald-600 dark:to-teal-500 dark:text-white dark:border-emerald-400/50 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]"
```

#### "Login / Registration" Button (Indigo/Blue)

Represents persistent data, cloud features, and trust.

```tsx
className="bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-500 dark:to-blue-600 text-white hover:opacity-90 hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/40"
```

## 4. Implementation Checklist

1.  [ ] **Font Size Check**: Are there any `text-xs`, `text-sm`, or `text-base` classes? -> **Promote to `text-lg`**.
2.  [ ] **Contrast Check**: Is light mode text `slate-600` or darker?
3.  [ ] **Glass Effect**: Are cards using `bg-white/80` (Light) and `backdrop-blur`?
4.  [ ] **Consolidated Styles**: Are buttons using the standard gradients?

## 5. Examples

### Hero Section Text

```tsx
<p className="text-lg md:text-xl text-slate-600 dark:text-muted-foreground">
  Description text goes here.
</p>
```

### Purpose Card

```tsx
<div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-white/50 ...">
  <h3 className="text-xl font-bold text-slate-800 dark:text-blue-100">Title</h3>
  <p className="text-lg text-slate-600 dark:text-indigo-200/80">Content</p>
</div>
```
