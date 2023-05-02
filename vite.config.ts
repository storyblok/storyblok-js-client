import { defineConfig } from 'vitest/config'

export default defineConfig(() => ({
	test: {
		setupFiles: ['./tests/setup.js'],
		coverage: {
      provider: 'c8',
			reporter: ['text', 'html'],
			exclude: [ '**/playground{,-*}/**', '**/mocks', '**/dist'],
    },
	},
}))
