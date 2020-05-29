import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import rollupResolve from '@rollup/plugin-node-resolve'
import rollupJson from '@rollup/plugin-json'
import rollupCommonjs from '@rollup/plugin-commonjs'

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
    exports: 'default',
    name: 'StoryblokClient',
    file: makeFileName(format)
  }
}

const factoryOutputStandalone = () => {
  return {
    ...factoryOutputObject('standalone'),
    format: 'iife'
  }
}

const plugins = [
  enableBabel && babel({ babelHelpers: 'bundled' }),
  rollupResolve({ jsnext: true, preferBuiltins: true, browser: true }),
  enableStandalone && rollupCommonjs(),
  enableStandalone && rollupJson(),
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
  external: enableStandalone ? [] : ['qs', 'axios']
}
