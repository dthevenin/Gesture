export default {
  input: 'src/index.js',
  external: ['vs_utils'],
  output: [
    {
      file: './dist/vs_gesture.js',
      name: 'vs_gesture',
      globals: { vs_utils: 'vs_utils' },
      format: 'iife',
    },
    {
      file: './es/vs_gesture.js',
      name: 'vs_gesture',
      globals: { vs_utils: 'vs_utils' },
      format: 'es',
    },
    {
      file: './lib/vs_gesture.js',
      name: 'vs_gesture',
      globals: { vs_utils: 'vs_utils' },
      format: 'amd'
    }
  ],
  plugins: [
  ]
};
