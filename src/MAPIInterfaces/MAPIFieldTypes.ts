/**
 * @interface ISbContentMAPIFieldTypes
 * @description This interface is generated from the API endpoint for field types
 * @reference https://www.storyblok.com/docs/api/management#core-resources/field-types/field-types
 */
export interface ISbContentMAPIFieldTypes {
	field_type: {
		id?: number
		name: string
		body?: string
		compiled_body?: string | ''
		space_ids?: number[]
	}
	publish?: string
}

/**
 * @interface ISbRetrieveMultipleFieldTypesParams
 * @description This interface is generated from the API endpoint for field types
 * @reference https://www.storyblok.com/docs/api/management/v1/#core-resources/field-types/retrieve-multiple-field-types
 */
export interface ISbRetrieveMultipleFieldTypesParams {
	field_type: {
		name: string
	}
}

// Aliases
export type FieldType = ISbContentMAPIFieldTypes
export type GetMultipleFieldTypes = ISbRetrieveMultipleFieldTypesParams