/**
 * @interface ISbAssets
 * @description Storyblok Content Management API Assets Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/assets/assets
 *
 **/
export interface ISbAssets {
	id?: number
	filename?: string
	space_id?: number
	created_at?: string
	updated_at?: string
	deleted_at?: string
	file?: object
	asset_folder_id?: number
	short_filename?: string
	content_type?: string
	content_length?: number
	is_private?: boolean
	validate_upload?: "1"
}

/**
 * @interface ISbRetrieveMultipleAssets
 * @description Storyblok Content Management API Retrieve Multiple Assets Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/assets/retrieve-multiple-assets
 * 
 */
export interface ISbRetrieveMultipleAssets {
	in_folder?: number
	sort_by?: 'created_at:asc' | 'created_at:desc' | 'updated_at:asc' | 'updated_at:desc' | 'short_filename:asc' | 'short_filename:desc'
	search?: string
	is_private?: '1'
}

/**
 * @interface ISbAssetFolders
 * @description Storyblok Content Management API Assets Folder Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/asset-folders/asset-folders
 *
 **/
export interface ISbAssetFolders {
	asset_folder: {
		id?: number
		name?: string
		parent_id?: number
	}
}

// Aliases
export type Assets = ISbAssets
export type AssetFolders = ISbAssetFolders
export type GetMultipleAssets = ISbRetrieveMultipleAssets
