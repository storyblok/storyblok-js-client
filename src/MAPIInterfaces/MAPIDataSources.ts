/**
 * @interface ISbContentMAPIDataSourceEntry
 * @description Storyblok Content Management API Data Source Entries Interface
 * @description This is used when creating a new data source entry
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasource-entries/datasource-entries
 *
 **/
export interface ISbContentMAPIDataSourceEntry {
	datasource_entry: {
		id?: number
		name:	string
		value: string
		datasource_id: number
		dimension_value?: string
		dimension_id?: number
	}
}

/**
 * @interface ISbContentMAPIDataSource
 * @description Storyblok Content Management API Data Source Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasources/datasources
 *
 **/
export interface ISbContentMAPIDataSource {
	datasource: {
		id?: number
		name?: string
		slug?: string
		dimensions?: Dimension[]
	}
}

/**
 * @interface ISbRetrieveMultipleDataSourcesParams
 * @description Storyblok Content Management API Data Source Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasources/retrieve-multiple-datasources
 **/
export interface ISbRetrieveMultipleDataSourcesParams {
	search?: string
	by_ids?: string[]
}

/**
 * @interface ISbRetrieveMultipleDataSourcesEntriesParams
 * @description Storyblok Content Management API Data Source Entries Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasource-entries/retrieve-multiple-datasource-entries
 * @description This is used when retrieving multiple data source entries
 **/
export interface ISbRetrieveMultipleDataSourcesEntriesParams {
	datasource_id: number
	datasource_slug: string
	dimension: string
}

type Dimension = {
	id: number
	name: string
	entry_value: string
	datasource_id: number
	created_at: string
	updated_at: string
}

// Aliases
export type DataSource = ISbContentMAPIDataSource
export type DataSourceEntry = ISbContentMAPIDataSourceEntry
export type GetDataSources = ISbRetrieveMultipleDataSourcesParams
export type GetDataSourcesEntries = ISbRetrieveMultipleDataSourcesEntriesParams