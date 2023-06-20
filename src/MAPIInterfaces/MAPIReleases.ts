/**
 * Interface MAPIReleases
 * @interface ISbContentMAPIReleases
 * @description Storyblok Content Management API Releases Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/releases/intro
 */
export interface ISbContentMAPIReleases {
	release: {
		name?: string
		id?:	number
		release_at?:	string
		released?:	boolean
		uuid?:	string
		timezone?:	string
		branches_to_deploy?:	string[] | number[]
		created_at?:	string
		owner_id?:	number
	}
	do_release?:	boolean
}

// Aliases
export type Release = ISbContentMAPIReleases