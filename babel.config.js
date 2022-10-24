const isTest = process.env.NODE_ENV === 'test'

const factoryPresetConfig = () => {
	if (isTest) {
		// when in test, we need to transform
		// the code to CommonJS before run the tests
		return {
			targets: {
				node: 'current',
			},
		}
	}

	return {
		// the modules: false option is to prevent
		// the babel transforms code before rollup
		modules: false,
		useBuiltIns: 'usage',
		corejs: 3,
	}
}

const factoryPluginsConfig = () => {
	if (isTest) {
		return []
	}

	return [['@babel/plugin-transform-runtime']]
}

module.exports = {
	presets: [['@babel/preset-env', factoryPresetConfig()]],
	plugins: factoryPluginsConfig(),
}
