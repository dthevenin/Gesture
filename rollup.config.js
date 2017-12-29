export default {
  input: 'src/index.js',
  external: ['vs_utils'],
  output: [
    {
      file: './dist/vs_gesture.js',
      name: 'vs_gesture',
      globals: {},
      format: 'iife',
    },
    {
      file: './es/vs_gesture.js',
      name: 'vs_gesture',
      globals: {},
      format: 'es',
    },
    {
      file: './lib/vs_gesture.js',
      name: 'vs_gesture',
      globals: {},
      format: 'amd'
    }
  ],
  plugins: [
  ]
};
