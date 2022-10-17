import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';
const nonbundledDependencies = Object.keys({ ...pkg.dependencies });

export default {
  input: pkg.source,
  output: [ {
    file: pkg.main,
    format: 'cjs'
  },
  {
    file: pkg.module,
    format: 'esm'
  } ],
  plugins: [
    commonjs()
  ],
  external: nonbundledDependencies
};
