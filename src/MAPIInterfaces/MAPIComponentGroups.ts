/**
 * @interface ISbContentMAPIComponentGroup
 * @description Storyblok Content Management API Component Group Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/component-groups/component-groups
 *
 **/
export interface ISbContentMAPIComponentGroup {
	component_group: {
		id?: number
		name: string
		uuid?: number | string
	}
}

// Aliases
export type ComponentGroup = ISbContentMAPIComponentGroup