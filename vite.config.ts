import { defineConfig } from 'vitest/config'
import tsconfigPath from 'vite-tsconfig-paths'
export default defineConfig({
  plugins: [tsconfigPath()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/use-cases/**/*.{test,spec}.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/http/controllers/**/*.{test,spec}.ts'],
          environment:
            './prisma/vitest-envirenment-prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
})
