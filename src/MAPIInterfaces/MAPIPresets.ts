/**
 * @interface ISbContentMAPIPresets
 * @description This interface is generated from the API endpoint for presets
 * @reference https://www.storyblok.com/docs/api/management#core-resources/presets/presets
 */
export interface ISbContentMAPIPresets {
	preset: {
		id?: number
		name: string
		preset?: object
		component_id?: number
		space_id?: number
		image?: string
		color?: string
		icon?: string
		description?: string
		isDefault?: boolean
		created_at?: string
		updated_at?: string
	}
}

/**
 * @interface ISbRetrieveMultiplePresetsParams
 * @description Storyblok Content Management API Preset Interface to retrieve multiple presets base in component id
 * @reference https://www.storyblok.com/docs/api/management/v1/#core-resources/presets/retrieve-multiple-presets
 */
export interface ISbRetrieveMultiplePresetsParams {
	component_id?: number
}

// Aliases for ISbContentMAPIPresets
export type Presets = ISbContentMAPIPresets

// Aliases for ISbRetrieveMultiplePresetsParams
export type GetPresets = ISbRetrieveMultiplePresetsParams
