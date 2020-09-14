const { BABEL_ENV } = process.env
const cjs = BABEL_ENV === 'commonjs'
const loose = true

module.exports = {
  presets: [['@babel/preset-env', { loose, modules: false }]],
  plugins: [
    [
      '@babel/transform-runtime',
      { helpers: true, useESModules: !cjs, corejs: 3 }
    ],
    cjs && ['@babel/transform-modules-commonjs', { loose }]
  ].filter(Boolean)
}
