import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';
const nonbundledDependencies = Object.keys({ ...pkg.dependencies });

export default {
  input: pkg.source,
  output: {
    file: pkg.exports['.'],
    sourcemap: true,
    format: 'esm'
  },
  plugins: [
    commonjs()
  ],
  external: nonbundledDependencies
};
