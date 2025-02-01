import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**'
    ]
  },
  ...compat.extends('next/core-web-vitals'),
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    ...compat.extends('plugin:@typescript-eslint/recommended')
  }
]; 