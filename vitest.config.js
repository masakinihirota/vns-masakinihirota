import { defineConfig } from "vitest/config";
import path from "path";


export default defineConfig({
    test: {
        include: ['src/app/**/*.test.tsx', 'tests/**/*.spec.ts', 'tests/**/*.test.tsx'],
        exclude: [
            'coverage/**',
            'dist/**',
            '**/*.d.ts',
            'cypress/**',
            '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
            'src/components_sample/**'
        ],
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts']
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
});

