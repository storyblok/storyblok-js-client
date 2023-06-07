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
		publish?: boolean
	}
}

// Aliases
export type FieldType = ISbContentMAPIFieldTypes