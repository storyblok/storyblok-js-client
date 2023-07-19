/**
 * @interface ISbContentMAPISpace
 * @description Storyblok Content Management API Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/the-space-object
 *
 */
export interface ISbContentMAPISpace {
	[key: string]: object
}

type TEnvironment = {
	name: string
	location: string
}

/**
 * @interface ISbContentMAPICreateSpace
 * @description Storyblok Content Management API Create Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/create-space
 */
export interface ISbContentMAPICreateSpace {
	[key: string]: {
		name: string
		domain?: string
		story_published_hook?: string
		searchblok_id?: number
		environments?: TEnvironment[]
	}
}

/**
 * @interface ISbContentMAPIUpdateSpace
 * @description Storyblok Content Management API Update Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/update-space
 */
export interface ISbContentMAPIUpdateSpace {
	[key: string]: {
		id?: number
		name?: string
		domain?: string
		uniq_domain?: string
		owner_id?: number
		parent_id?: number
		duplicatable?: boolean
		default_root?: number
		options?: {
			[key: string]: any
		}
		routes?:	{
			[key: string]: any
		}
		story_published_hook?: string
		searchblok_id?: number
		environments?: TEnvironment[]
		billing_address?: {
			[key: string]: any
		}
	}
}

/**
 * @interface ISbContentMAPIDuplicateSpace
 * @description Storyblok Content Management API Duplicate Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/duplicate-space
 */
export interface ISbContentMAPIDuplicateSpace {
	dup_id: number
	[key: string]: ContentData | number
}

type ContentData = {
	name: string
	domain?: string
	story_published_hook?: string
	searchblok_id?: number
	environments?: TEnvironment[]
}


// Aliases
export type Space = ISbContentMAPISpace

export type CreateSpace = ISbContentMAPICreateSpace
export type UpdateSpace = ISbContentMAPIUpdateSpace
export type DuplicateSpace = ISbContentMAPIDuplicateSpace
