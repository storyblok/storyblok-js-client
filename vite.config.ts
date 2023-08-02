import { defineConfig } from 'vite'

export default defineConfig(() => ({
	define: {
		VITE_PACKAGE_VERSION: process.env.npm_package_version,
	},
	test: {
		setupFiles: ['./tests/setup.js'],
	},
}))
