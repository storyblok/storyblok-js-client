/**
 * @type TComponent
 * @description Storyblok Content Management API Component Type
 * @reference https://www.storyblok.com/docs/api/management#core-resources/components/the-component-object
 */
type TComponent = {
	id?: number
	name?: string
	display_name?: string
	created_at?: string
	image?: string
	preview?: string
	is_root?: boolean
	is_nestable?: boolean
	all_presets?: string[]
	real_name?: string
	component_group_uuid?: string
}

/**
 * @type TComponentFieldTypes
 * @description Storyblok Content Management API Component Field Type
 * @reference https://www.storyblok.com/docs/api/management#core-resources/components/possible-field-types
 */
type TComponentFieldTypes =
	| 'bloks'
	| 'text'
	| 'textarea'
	| 'markdown'
	| 'number'
	| 'datetime'
	| 'boolean'
	| 'options'
	| 'option'
	| 'image'
	| 'file'
	| 'multiasset'
	| 'multilink'
	| 'section'
	| 'custom'

/**
 * @type TComponentField
 * @description Storyblok Content Management API Component Field Type
 * @reference https://www.storyblok.com/docs/api/management#core-resources/components/the-component-field-object
 */
type TComponentField = {
	[key: string]: {
		id?: number
		type?: TComponentFieldTypes
		pos?: number
		translatable?: boolean
		required?: boolean
		regex?: string
		description?: string
		default_value?: string
		can_sync?: boolean
		preview_field?: boolean
		no_translate?: boolean
		rtl?: boolean
		rich_markdown?: boolean
		keys?: string[]
		field_type?: string
		source?: undefined | 'internal_stories' | 'internal' | 'external'
		use_uuid?: boolean
		folder_slug?: string
		datasource_slug?: string
		external_datasource?: string
		options?: { name?: string; value?: string }[]
		image_crop?: boolean
		keep_image_size?: boolean
		image_width?: number | string
		image_height?: number | string
		asset_folder_id?: number
		add_https?: boolean
		restrict_components?: boolean
		maximum?: number
		restrict_content_types?: boolean
		component_whitelist?: ('post' | 'page' | 'product')[]
		disable_time?: boolean
		max_length?: number
		filetypes?: ('images' | 'videos' | 'audios' | 'texts')[]
		title?: string
		image?: string
	}
}

/**
 * @interface ISbContentMAPIComponent
 * @description Storyblok Content Management API Component Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/components/components
 *
 **/
export interface ISbContentMAPIComponent {
	component: TComponent
	name?: string
	display_name?: string
	image?: string
	preview?: string
	is_root?: boolean
	is_nestable?: boolean
	component_group_uuid?: string
	schema?: TComponentField
}

// Aliases
export type Component = ISbContentMAPIComponent