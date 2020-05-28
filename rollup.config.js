import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const pkg = require('./package.json')

const enableBabel = process.env.ENABLE_BABEL === 'yes'
const enableStandalone = process.env.STANDALONE === 'yes'

const getDistFolder = (fileName = '') => {
  return `dist/${enableBabel ? 'es5/' : ''}${fileName}`
}

const year = new Date().getFullYear()

const yearString = (year === 2018) ? '2018' : `2018-${year}`

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * (c) ${yearString} Stobylok
 */`

const makeFileName = (format) => getDistFolder(`index.${format}.js`)

const factoryOutputObject = format => {
  return {
    format,
    banner,
    exports: 'named',
    name: 'Storyblok',
    file: makeFileName(format)
  }
}

const factoryOutputStandalone = () => {
  return {
    ...factoryOutputObject('standalone'),
    format: 'iife',
    globals: {
      axios: 'axios'
    }
  }
}

const plugins = [
  enableBabel && babel({ babelHelpers: 'bundled' }),
  resolve(),
  enableStandalone && commonjs(),
  terser()
].filter(Boolean)

export default {
  input: 'source/index.js',
  output: enableStandalone ? [
    factoryOutputStandalone()
  ] : [
    factoryOutputObject('es'),
    factoryOutputObject('cjs')
  ],
  plugins,
  // when standalone, put all external libraries into final code
  external: [ !enableStandalone && 'qs', 'axios' ].filter(Boolean)
}
