/**
 * @interface ISBContentMAPIPresets
 * @description This interface is generated from the API endpoint for presets
 * @reference https://www.storyblok.com/docs/api/management#core-resources/presets/presets
 */
export interface ISBContentMAPIPresets {
	preset: {
		id?: number
		name: string
		preset?: object
		component_id?: number
		image?: string
		created_at?: string
		updated_at?: string
	}
}

// Aliases
export type Preset = ISBContentMAPIPresets