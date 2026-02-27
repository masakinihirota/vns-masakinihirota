import { Category, MandalaTemplate, Profile } from "./skill-comparison.logic";

/**
 * カテゴリ定数
 */
export const CATEGORIES: readonly Category[] = [
  { id: "FRONTEND", label: "Frontend", iconName: "Monitor" },
  { id: "BACKEND_AI", label: "AI / Backend", iconName: "Cpu" },
  { id: "INFRA", label: "Infrastructure", iconName: "Terminal" },
] as const;

/**
 * スキルテンプレート
 */
export const MANDALA_TEMPLATES: { readonly [key: string]: MandalaTemplate } = {
  "React / Next.js": {
    category: "FRONTEND",
    items: [
      "Hooks (useEffect/Memo)",
      "State Management",
      "Server Components",
      "Performance Tuning",
      "Testing (Jest/Vitest)",
      "TypeScript Integration",
      "Routing (App Router)",
      "CSS Frameworks",
    ],
  },
  "Vue / Nuxt": {
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

/**
 * 自分のプロフィール
 */
export const MY_PROFILES: readonly Profile[] = [
  {
    id: "masakinihirota",
    name: "masakinihirota",
    role: "Full Stack Developer",
    mastery: {
      "React / Next.js": [0, 1, 2, 5, 6, 7],
      "Python / AI": [0, 3, 4, 7],
      Infrastructure: [0, 1, 2, 4, 5],
    },
  },
  {
    id: "hirota-lead",
    name: "Hirota (Lead Mode)",
    role: "Engineering Manager",
    mastery: {
      "React / Next.js": [0, 1, 6],
      "Python / AI": [0, 1],
      Infrastructure: [0, 1, 2, 3, 4, 5, 6, 7],
      "Node.js / Go": [0, 1, 2, 3, 4, 5],
    },
  },
] as const;

/**
 * 候補者データ
 */
export const CANDIDATES: readonly Profile[] = [
  {
    id: "1",
    name: "田中 健太",
    role: "Frontend Specialist",
    mastery: {
      "React / Next.js": [0, 1, 3, 4, 7],
      "Python / AI": [0],
    },
  },
  {
    id: "2",
    name: "佐藤 結衣",
    role: "AI / Data Engineer",
    mastery: {
      "React / Next.js": [0, 7],
      "Python / AI": [0, 1, 2, 3, 4, 5, 6, 7],
    },
  },
  {
    id: "3",
    name: "鈴木 一郎",
    role: "Cloud Architect",
    mastery: {
      Infrastructure: [0, 1, 2, 3, 4, 5, 6, 7],
      "React / Next.js": [0, 1, 2],
    },
  },
  {
    id: "4",
    name: "伊藤 舞",
    role: "Backend Dev",
    mastery: {
      "Node.js / Go": [0, 1, 2, 3, 4],
      "React / Next.js": [0, 1, 2, 3, 4, 5],
    },
  },
] as const;
