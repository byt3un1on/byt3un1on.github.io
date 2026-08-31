import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.ts', 'tests/it/**/*_test_integration.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      include: ['adapters/**/*.ts', 'core/**/*.ts', 'infra/**/*.ts'],
      exclude: [
        'main.ts',
        'main_catalog.ts',
        'main_report.ts',
        'infra/init/ioc_init.ts',
        'infra/init/cli_ioc_init.ts',
        'infra/init/web_init.ts',
        'infra/init/web_server.ts',
      ],
      thresholds: {
        perFile: true,
        lines: 90,
        statements: 90,
        branches: 90,
        functions: 90,
      },
    },
  },
});
