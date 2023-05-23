/**
 * @interface ISBContentMAPISpaceRoles
 * @description Storyblok Content Management API Space Roles Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/space-roles/space-roles
 *
 */
export interface ISBContentMAPISpaceRoles {
	space_role: {
		id?: number
		name: string
		role?: string
		access_tasks?: string[]
		allowed_paths?: string[]
		resolved_allowed_paths?: string[]
		field_permissions?: string[]
		permissions?: TPermissions[]
	}
}

type TPermissions = {
	publish_stories: boolean
	save_stories: boolean
	edit_datasources: boolean
	access_commerce: boolean
	edit_story_slug: boolean
	move_story: boolean
	view_composer: boolean
}

// Aliases
export type SpaceRoles = ISBContentMAPISpaceRoles
