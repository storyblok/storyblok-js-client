/**
 * @interface ISbContentMAPIDataSourceEntry
 * @description Storyblok Content Management API Data Source Entries Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasource-entries/datasource-entries
 *
 **/
export interface ISbContentMAPIDataSourceEntry {
	id?: number
	name?: string
	value?: string
	datasource_id?: number | string
}

/**
 * @interface ISbContentMAPICRUDDataSourceEntry
 * @description Storyblok Content Management API Data Source Entry Interface
 * @description One can use this as an auxiliary interface to create or update a data source entry
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasource-entries/create-datasource-entry
 *
 **/
export interface ISbContentMAPICRUDDataSourceEntry {
	datasource_entry: ISbContentMAPIDataSourceEntry
	name: string
	value: string
	data_source_id?: number | string
	dimension_id?: number
	dimension_value?: string
}

/**
 * @interface ISbContentMAPIDataSource
 * @description Storyblok Content Management API Data Source Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/datasources/datasources
 *
 **/
export interface ISbContentMAPIDataSource {
	id?: number
	name?: string
	slug?: string
	dimensions?: unknown[]
}
