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
	story: {
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
		publish?: boolean
		release_id?: number
	}
}

/**
 * @interface ISbContentMAPIGetMultipleStories
 * @description Storyblok Content Management API Multiple Stories Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/stories/retrieve-multiple-stories
 */
export interface ISbContentMAPIGetMultipleStories {
	page?: number
	contain_component?: string
	text_search?: string
	sort_by?: string
	pinned?: boolean | '1'
	excluding_ids?: string
	by_ids?: string
	by_uuids?: string
	with_tag?: string
	folder_only?: boolean
	story_only?: boolean
	with_parent?: string
	with_slug?: string
	starts_with?: string
	in_trash?: boolean
	search?: string
	filter_query?: string
	in_release?: string
	is_published?: boolean
}

/**
 * @interface ISbContentMAPIUpdateStory
 * @description Storyblok Content Management API Update Story Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/stories/update-story
 */
export interface ISbContentMAPIUpdateStory extends ISbContentMAPIStory {
	alternates?: object[]
	disble_fe_editor?: boolean
	group_id?: string
	force_update?: boolean
	lang?: string
}


// Aliases
export type CreateStory = ISbContentMAPIStory
export type UpdateStory = ISbContentMAPIUpdateStory
export type GetMultipleStories = ISbContentMAPIGetMultipleStories
