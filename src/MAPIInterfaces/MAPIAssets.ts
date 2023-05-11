/**
 * @interface ISbAsset
 * @description Storyblok Content Management API Asset Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/assets/assets
 *
 **/
export interface ISbAsset {
	filename?: string
	size?: string
	asset_folder_id?: number
	id?: number
	validate_upload: '1' | null
}

/**
 * @interface ISbAssetFolder
 * @description Storyblok Content Management API Asset Folder Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/asset-folders/asset-folders
 *
 **/
export interface ISbAssetFolder {
	asset_folder: {
		name: string
	}
}
