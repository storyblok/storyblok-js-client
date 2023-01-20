import { defineConfig } from 'vite'

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
