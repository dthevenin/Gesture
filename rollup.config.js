const env = process.env.NODE_ENV

const config = {
  entry: 'src/index.js',
  external: ['vs_utils'],
  globals: {},
  format: 'amd',
  moduleName: 'VSGesture',
  plugins: [
  ]
}

if (env === 'production') {
}

export default config
