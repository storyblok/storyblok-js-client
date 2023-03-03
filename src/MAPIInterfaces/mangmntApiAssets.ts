/**
 * @interface ISbAsset
 * @description Storyblok Content Management API Asset Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/assets/assets
 *
 **/
export interface ISbAsset {
	id?: number
	filename?: string
	space_id?: number
	created_at?: string
	updated_at?: string
	deleted_at?: string
	file?: {
		url: string
	}
	asset_folder_id?: number
	short_filename?: string
	content_type?: string
	content_length?: number
	is_private?: '1' | null
}

/**
 * @interface ISbAssetSignedResponseObject
 * @description Storyblok Content Management API Asset Response Object Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/assets/signed-response-object
 *
 **/
export interface ISbAssetSignedResponseObject {
	pretty_url: string
	public_url: string
	fields: {
		key: string
		acl: string
		Expires: string
		'Cache-Control': string
		'Content-Type': string
		policy: string
		'x-amz-credential': string
		'x-amz-algorithm': string
		'x-amz-date': string
		'x-amz-signature': string
	}
	post_url: string
}

/**
 * @interface ISbMultipleAssets
 * @description Storyblok Content Management API Multiple Assets Interface
 * @description This is the response object when one requests multiple assets
 * @reference https://www.storyblok.com/docs/api/management#core-resources/assets/retrieve-multiple-assets
 *
 **/
export interface ISbMultipleAssets {
	in_folder?: number
	sort_by?:
		| 'created_at:asc'
		| 'created_at:desc'
		| 'updated_at:asc'
		| 'updated_at:desc'
		| 'short_filename:asc'
		| 'short_filename:desc'
	search?: string
	is_private?: '1' | null
	get RetrieveMultipleAssets(): ISbAsset[]
}
