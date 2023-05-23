/**
 * @interface ISBContentMAPISpace
 * @description Storyblok Content Management API Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/spaces
 *
 */
export interface ISBContentMAPISpace {
	space: {
		[key: string]: any
	}
}

type TEnvironment = {
	name: string
	location: string
}

/**
 * @interface ISBContentMAPICreateSpace
 * @description Storyblok Content Management API Create Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/create-space
 */
export interface ISBContentMAPICreateSpace {
	space: {
		name: string
		domain?: string
		story_published_hook?: string
		searchblok_id?: number
		environments?: TEnvironment[]
	}
}

/**
 * @interface ISBContentMAPIUpdateSpace
 * @description Storyblok Content Management API Update Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/update-space
 */
export interface ISBContentMAPIUpdateSpace {
	space: {
		id: number
		name: string
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
 * @interface ISBContentMAPIDuplicateSpace
 * @description Storyblok Content Management API Duplicate Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/duplicate-space
 */
export interface ISBContentMAPIDuplicateSpace {
	dup_id: number
	space: {
		name: string
		domain: string
		story_published_hook: string
		searchblok_id: number
		environments: TEnvironment[]
	}
}


// Aliases
export type Space = ISBContentMAPISpace

export type CreateSpace = ISBContentMAPICreateSpace
export type UpdateSpace = ISBContentMAPIUpdateSpace
export type DuplicateSpace = ISBContentMAPIDuplicateSpace
