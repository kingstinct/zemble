import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    '**/*.ts',
    '**/*.tsx',
    '!**/*.test.ts',
    '!**/*.d.ts',
    '!**/scripts/*.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  outDir: 'dist',
  clean: true,
  skipNodeModulesBundle: true,
  tsconfig: './tsconfig.tsup.json',
})
