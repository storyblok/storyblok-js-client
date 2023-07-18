/**
 * @type TComponentGroup
 * @description Storyblok Content Management API Component Group Type
 * @reference https://www.storyblok.com/docs/api/management#core-resources/component-groups/the-component-group-object
 */
type TComponentGroup = {
	component_group: {
		id?: number
		name?: string
		uuid?: string
	}
}
/**
 * @interface ISbContentMAPIComponentGroup
 * @description Storyblok Content Management API Component Group Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/component-groups/component-groups
 *
 **/
export interface ISbContentMAPIComponentGroup {
	component_group: TComponentGroup
	name?: string
}

// Aliases
export type ComponentGroup = ISbContentMAPIComponentGroup