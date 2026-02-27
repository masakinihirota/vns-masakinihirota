import { Cpu, Monitor, Terminal } from "lucide-react";

import { Category, CategoryId, SkillTemplate } from "./types";

/**
 * カテゴリ定義
 */
export const CATEGORIES: Readonly<Record<CategoryId, Category>> = {
  FRONTEND: {
    id: "FRONTEND",
    label: "Frontend",
    icon: Monitor,
    color: "text-blue-500",
  },
  BACKEND_AI: {
    id: "BACKEND_AI",
    label: "AI / Backend",
    icon: Cpu,
    color: "text-purple-500",
  },
  INFRA: {
    id: "INFRA",
    label: "Infrastructure",
    icon: Terminal,
    color: "text-orange-500",
  },
} as const;

/**
 * マンダラチャートのテンプレート
 */
export const MANDALA_TEMPLATES: Readonly<Record<string, SkillTemplate>> = {
  "React / Next.js": {
    id: "React / Next.js",
    category: "FRONTEND",
    items: [
      "Hooks (useEffect/Memo)",
      "State Management",
      "Server Components",
      "Performance Tuning",
      "Testing (Jest/Cypress)",
      "TypeScript Integration",
      "Routing (App Router)",
      "CSS Frameworks",
    ],
  },
  "Vue / Nuxt": {
    id: "Vue / Nuxt",
    category: "FRONTEND",
    items: [
      "Composition API",
      "Pinia",
      "Server Side Rendering",
      "Vite Setup",
      "Vitest",
      "TypeScript Support",
      "Middleware",
      "Tailwind Integration",
    ],
  },
  "Python / AI": {
    id: "Python / AI",
    category: "BACKEND_AI",
    items: [
      "Pandas/Data Analysis",
      "Deep Learning Theory",
      "PyTorch/TensorFlow",
      "API (FastAPI/Flask)",
      "LLM Prompt Engineering",
      "Fine-tuning",
      "Vector Databases",
      "Deployment (Docker)",
    ],
  },
  "Node.js / Go": {
    id: "Node.js / Go",
    category: "BACKEND_AI",
    items: [
      "Express/NestJS",
      "gRPC / Protobuf",
      "Concurrency",
      "Auth (JWT/OAuth)",
      "ORM (Prisma/Gorm)",
      "Microservices",
      "Unit Testing",
      "Logging/Tracing",
    ],
  },
  Infrastructure: {
    id: "Infrastructure",
    category: "INFRA",
    items: [
      "AWS Core Services",
      "Terraform / IaC",
      "Docker / K8s",
      "CI/CD Pipelines",
      "Security Best Practices",
      "Monitoring (Datadog)",
      "Network Design",
      "Cost Optimization",
    ],
  },
} as const;
