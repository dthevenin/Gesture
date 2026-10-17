import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: `src/gesture/index.ts`,
    plugins: [esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      tsconfig: 'src/tsconfig.json'
    })],
    output: [
      {
        file: `dist/vs_gesture.amd.js`,
        format: 'amd',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: `dist/vs_gesture.es.js`,
        format: 'es',
        sourcemap: true,
        exports: 'named',
      },
    ]
  },
  {
    input: `build/gesture/index.d.ts`,
    plugins: [dts()],
    output: {
      file: `dist/vs_gesture.d.ts`,
      format: 'es',
    },
  }
];


