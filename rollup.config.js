import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'

const pkg = require('./package.json')

const enableBabel = process.env.ENABLE_BABEL === 'yes'

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
    name: 'StoryblokClient',
    file: makeFileName(format)
  }
}

const plugins = [
  enableBabel && babel({ babelHelpers: 'bundled' }),
  resolve(),
  terser()
].filter(Boolean)

export default {
  input: 'source/index.js',
  output: [
    factoryOutputObject('es'),
    factoryOutputObject('cjs')
  ],
  plugins,
  external: ['axios', 'qs']
}
