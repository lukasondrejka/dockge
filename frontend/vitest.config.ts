import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    check: false,
    environment: 'jsdom',
    setupFiles: ['vitest-localstorage-mock', './setupTests.ts'],
    mockReset: false,
    testMatch: ['**/*.test.ts'],
    exclude: ['node_modules', '.git', 'dist'],
    coverage: {
      provider: 'istanbul' // or 'v8'
    },
  }
});
