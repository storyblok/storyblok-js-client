import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

let firstRunCounter = 0
const bundles = [
	{
		entry: 'entry.esm.ts',
		formats: ['es'],
		fileName: 'index',
	},
	{
		entry: 'entry.umd.ts',
		formats: ['umd'],
		name: 'StoryblokJSClient',
		fileName: 'index',
	},
	{
		entry: 'richTextResolver.ts',
		formats: ['es', 'umd'],
		name: 'RichTextResolver',
		fileName: 'richTextResolver',
	},
	{
		entry: 'schema.ts',
		formats: ['es', 'umd'],
		name: 'RichTextSchema',
		fileName: 'schema',
	},
]

;(async () => {
	for (const bundle of bundles) {
		await build({
			configFile: false,
			build: {
				lib: {
					entry: path.resolve(__dirname, 'src', bundle.entry),
					formats: bundle.formats,
					name: bundle.name,
					fileName: bundle.fileName,
				},
				emptyOutDir: !firstRunCounter++,
			},
		})
	}
})()
