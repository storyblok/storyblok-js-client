import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import rollupResolve from '@rollup/plugin-node-resolve'
import rollupJson from '@rollup/plugin-json'
import rollupCommonjs from '@rollup/plugin-commonjs'
import mjsEntry from 'rollup-plugin-mjs-entry'

const pkg = require('./package.json')

const enableBabel = process.env.ENABLE_BABEL === 'yes'
const enableStandalone = process.env.STANDALONE === 'yes'

const getDistFolder = (fileName = '') => {
  return `dist/${enableBabel ? 'es5/' : ''}${fileName}`
}

const year = new Date().getFullYear()

const yearString = (year === 2020) ? '2020' : `2020-${year}`

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * (c) ${yearString} Stobylok Team
 */`

 const richtextBanner = `/*!
 * RichTextResolver v${pkg.version}
 * ${pkg.description}
 * (c) ${yearString} Stobylok Team
 */`

const makeFileName = (format, file = 'index') => {
  if (format === 'standalone') {
    return getDistFolder(`${file}.${format}.js`)
  }
  return getDistFolder(`${file}.js`)
}

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
  // to generate file with .mjs extension
  mjsEntry(),

  // to resolve correctly non-esmodules packages
  rollupResolve({ jsnext: true, preferBuiltins: true, browser: true}),

  // to include, when not external, non-esmodules packages (axios and qs e.g)
  rollupCommonjs(),

  enableStandalone && rollupJson(),

  // to minify the code
  terser(),

  // to run babel
  enableBabel && babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**' // only transpile our source code
  })
].filter(Boolean)

const factoryRichTextOutput = format => {
  return {
    format,
    banner: richtextBanner,
    exports: 'default',
    name: 'RichTextResolver',
    file: makeFileName(format, 'rich-text-resolver')
  }
}

export default [

  // StoryblokClient
  {
    input: 'source/index.js',
    output: enableStandalone ? [
      factoryOutputStandalone()
    ] : [
      factoryOutputObject('cjs')
    ],
    plugins,
  },

  // Richtext
  {
    input: 'source/richTextResolver.js',
    output: enableStandalone ? [
      {
        ...factoryRichTextOutput('standalone'),
        format: 'iife'
      }
    ] : [
      factoryRichTextOutput('cjs')
    ],
    plugins
  }
]
