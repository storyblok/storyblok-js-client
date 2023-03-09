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

type TComponentSchema = {
	[key: string]: {
		id: number
		type: TComponentFieldTypes
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
		component_whitelist?: string[]
		disable_time?: boolean
		max_length?: number
		filetypes?: string[]
	}
}

/**
 * @interface ISbContentMAPIComponentGroup
 * @description Storyblok Content Management API Component Group Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/component-groups/component-groups
 *
 **/
export interface ISbContentMAPIComponentGroup {
	component_group: {
		id?: number
		name: string
		uuid?: number | string
	}
}

/**
 * @interface ISbContentMAPIComponent
 * @description Storyblok Content Management API Component Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/components/components
 *
 **/
export interface ISbContentMAPIComponent {
	component: {
		id?: number
		name: string
		display_name?: string
		image?: string
		preview?: string
		is_root?: boolean
		is_nestable?: boolean
		component_group_uuid?: string
		schema?: TComponentSchema
	}
}
