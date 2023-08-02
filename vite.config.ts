import { defineConfig } from 'vite'

export default defineConfig(() => ({
	define: {
		packageVersion: JSON.stringify(process.env.npm_package_version),
	},
	test: {
		setupFiles: ['./tests/setup.js'],
	},
}))
