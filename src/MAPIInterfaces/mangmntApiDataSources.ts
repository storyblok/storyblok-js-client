/**
 * @interface ISbContentMangmntAPIDataSourceEntries
 * @description Storyblok Content Management API Data Source Entries Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasource-entries/datasource-entries
 *
 **/
export interface ISbContentMangmntAPIDataSourceEntries {
	id?: number
	name?: string
	value?: string
	datasource_slug?: string
	dimension: unknown
	datasource_id?: number
	dimension_value?: unknown
	dimension_id?: number
}

/**
 * @interface ISbContentMangmntAPIDataSource
 * @description Storyblok Content Management API Data Source Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasources/datasources
 *
 **/
export interface ISbContentMangmntAPIDataSource {
	id?: number
	name?: string
	slug?: string
	dimensions?: unknown[]
	search?: string
	by_ids?: string[]
	datasource?: ISbContentMangmntAPIDataSource
}
