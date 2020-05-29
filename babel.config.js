const isTest = process.env.NODE_ENV === 'test'

const factoryPresetConfig = () => {
  const config = {
    // the `modules: false` is to Babel doesn't transform
    // the code to CommonJS before the rollup executes
    modules: isTest ? 'auto' : false
  }

  if (isTest) {
    // when in test, we need to transform
    // the code to CommonJS before run the tests
    config['targets'] = {
      node: 'current'
    }
  }

  return config
}

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      factoryPresetConfig()
    ]
  ]
}