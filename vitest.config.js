import { defineConfig } from "vitest/config";
import path from "path";


export default defineConfig({
    test: {
        // include: ['src/**/*.test.tsx'],
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: [
            '_sample',
            '_Template',
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

