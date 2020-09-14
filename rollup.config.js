import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV === 'development'

export default {
  input: 'src/index.js',
  output: {
    format: 'umd',
    name: pkg.name,
    sourcemap: true
  },
  plugins: [
    nodeResolve(),

    commonjs(),

    json(),

    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**'
    }),

    replace({
      ENV: JSON.stringify(NODE_ENV || 'development')
    }),

    !isDev &&
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
  ]
}
