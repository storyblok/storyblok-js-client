import { ISbComponentType, ISbContentMAPI } from '../interfaces'

type TPreviewToken = {
	token: string
	timestamp: number | string
}

type TLastAuthor = {
	id: number
	userid: string
}

/**
 * @interface ISbContentMAPIStory
 * @description Storyblok Content Management API Story Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/stories/stories
 *
 **/
export interface ISbContentMAPIStory {
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
	parent?: ISbContentMAPIStory
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
		lang: ISbContentMAPI['lang']
	}[]
}
