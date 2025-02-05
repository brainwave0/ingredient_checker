import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/IngredientChecker.svelte',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true
      }
    }),
    resolve({
      browser: true,
      exportConditions: ['svelte'],
      extensions: ['.svelte'],
    }),
  ]
}
