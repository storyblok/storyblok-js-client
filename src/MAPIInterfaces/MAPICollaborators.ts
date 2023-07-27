type TUser = {
	user: {
		id?: number
		firstname?: string
		lastname?: string
		alt_email?: string
		avatar?: string
		userid?: string
		friendly_name?: string
	}
}

/**
 * @interface ISbContentMAPICollaboratorsCollection
 * @description This interface is generated from the API endpoint for collaborators
 * @reference https://www.storyblok.com/docs/api/management#core-resources/collaborators/the-collaborator-object
 */
export interface ISbContentMAPICollaboratorsCollection {
  collaborators: ISbContentMAPICollaborator[]
}

export interface ISbContentMAPICollaborator {
  user?: TUser
  role?: string
  user_id?: number
  permissions?: string[]
  allowed_path?: string
  field_permissions?: string
  id?: number
  space_role_id?: string
  invitation?: string
  space_role_ids?: any[]
  space_id?: number
}

/**
 * @interface ISbContentMAPICollaboratorAdd
 * @description This interface is generated from the API endpoint for collaborators
 * @reference https://www.storyblok.com/docs/api/management#core-resources/collaborators/add-collaborator
 */
export interface ISbContentMAPICollaboratorAdd {
	email?: string
	role?: string
	space_id?: number
	space_role_id?: number
	space_role_ids?: number[]
	permissions?: string[]
	allow_multiple_roles_creation?: boolean
}

/**
 * @interface ISbContentMAPICollaboratorAddUsersWithSSO
 * @description This interface is generated from the API endpoint for collaborators
 * @reference https://www.storyblok.com/docs/api/management#core-resources/collaborators/add-users-with-sso
 */
export interface ISbContentMAPICollaboratorAddUsersWithSSO {
	sso_id?: string
	email?: string
	role?: string
	space_role_id?: number
}


// Aliases
export type Collaborator = ISbContentMAPICollaborator
export type Collaborators = ISbContentMAPICollaboratorsCollection
export type AddCollaborator = ISbContentMAPICollaboratorAdd
export type AddCollaboratorUsersWithSSO = ISbContentMAPICollaboratorAddUsersWithSSO