export interface ISBContentMAPIPresets {
	id?: number
	name: string
	preset: object
	component_id: number
	image?: string
	created_at?: string
	updated_at?: string
}

// Aliases
export type Preset = ISBContentMAPIPresets