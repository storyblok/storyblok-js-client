import { ISbComponentType, ISbContentMangmntAPI } from './interfaces'

type TPreviewToken = {
	token: string
	timestamp: number | string
}

type TLastAuthor = {
	id: number
	userid: string
}

export interface ISbContentMangmntAPIStory {
	id?: number
	uuid?: string
	name: string
	slug: string
	full_slug?: string
	path?: string
	content?: ISbComponentType<string> & { [index: string]: any }
	realease_id?: number | string
	published?: boolean
	unpublished_changes?: boolean
	position?: number
	is_startpage?: boolean
	is_folder?: boolean
	default_root?: boolean
	disble_fe_editor?: boolean
	parent_id?: number | string
	parent?: ISbContentMangmntAPIStory
	group_id?: string | number
	alternates?: object[]
	tag_list?: string[]
	breadcrumbs?: object[]
	sort_by_date?: string
	meta_data?: JSON
	pinned?: boolean
	preview_token?: TPreviewToken
	last_author?: TLastAuthor
	created_at?: string
	updated_at?: string
	published_at?: string
	first_published_at?: string
	imported_at?: string
	translated_slugs_attributes?: {
		path: string
		name: string | null
		lang: ISbContentMangmntAPI['lang']
	}[]
}

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

export interface ISbContentMangmntAPIComponent {
	id?: number
	schema?: TComponentSchema
	name: string
	display_name?: string
	created_at?: string
	image?: string
	preview?: string
	is_root?: boolean
	is_nestable?: boolean
	all_presets?: object[]
	real_name?: string
	component_group_uuid?: string
}
export interface ISbContentMangmntAPIDataSourceEntries {
	id?: number
	name?: string
	value?: string
	datasource_slug?: string
	dimension: unknown
	datasource_id?: number
	dimension_value?: unknown
	dimension_id?: number
}

export interface ISbContentMangmntAPIDataSource {
	id?: number
	name?: string
	slug?: string
	dimensions?: unknown[]
	search?: string
	by_ids?: string[]
	datasource?: ISbContentMangmntAPIDataSource
}
