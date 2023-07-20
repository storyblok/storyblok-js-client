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
	file?: object
	asset_folder_id?: number
	short_filename?: string
	content_type?: string
	content_length?: number
	is_private?: boolean
	validate_upload?: "1"
}

/**
 * @interface ISbAssetFolder
 * @description Storyblok Content Management API Asset Folder Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/asset-folders/asset-folders
 *
 **/
export interface ISbAssetFolder {
	asset_folder: {
		id?: number
		name?: string
		parent_id?: number
	}
}

// Aliases
export type Asset = ISbAsset
export type AssetFolder = ISbAssetFolder
