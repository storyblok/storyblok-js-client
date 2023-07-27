/**
 * @interface ISbContentMAPISpaceRoles
 * @description Storyblok Content Management API Space Roles Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/space-roles/the-space-role-object
 */
export interface ISbContentMAPISpaceRoles {
	id?: number
	role?: string
	access_tasks?: boolean
	allowed_paths?: number[]
	resolved_allowed_paths?: string[]
	field_permissions?: string[]
	permissions?: TPermissions[]
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

/**
 * @interface ISbContentMAPISpaceRolesCreate
 * @description Storyblok Content Management API Space Roles Create Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/space-roles/create-space-role
 */
export interface ISbContentMAPISpaceRolesCreate {
	space_role: {
		space_role: ISbContentMAPISpaceRoles
		role?: string
	}
}

/**
 * @interface ISbContentMAPISpaceRolesUpdate
 * @description Storyblok Content Management API Space Roles Update Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/space-roles/update-space-role
 */
export interface ISbContentMAPISpaceRolesUpdate {
	space_role: {
		space_role: ISbContentMAPISpaceRoles
		role?: string
	}
}

// Aliases
export type SpaceRoles = ISbContentMAPISpaceRoles

export type SpaceRolesCreate = ISbContentMAPISpaceRolesCreate
export type SpaceRolesUpdate = ISbContentMAPISpaceRolesUpdate
