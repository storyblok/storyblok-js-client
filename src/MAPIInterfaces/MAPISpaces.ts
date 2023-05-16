/**
 * @interface ISBContentMAPISpaceRoles
 * @description Storyblok Content Management API Space Roles Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/space-roles/space-roles
 *
 */

export interface ISBContentMAPISpaceRoles {
	space_role: {
		role: string
	}
}

type TEnvironment = {
	name: string
	location: string
}

/**
 * @interface ISBContentMAPISpace
 * @description Storyblok Content Management API Space Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/spaces/spaces
 *
 */
export interface ISBContentMAPISpace {
	space: {
		name: string
		domain?: string
		story_published_hook?: string
		searchblok_id?: number
		environments?: TEnvironment[]
		id?: number
		uniq_domain?: string
		owner_id?: number
		parent_id?: number
		duplicatable?: boolean
		default_root?: string | 'page'
		options?: object
		routes?: object[] | string[]
		billing_address?: object
	}
}

// Aliases
export type SpaceRoles = ISBContentMAPISpaceRoles
export type Space = ISBContentMAPISpace
