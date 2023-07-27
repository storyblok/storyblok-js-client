/**
 * @type TComponentGroup
 * @description Storyblok Content Management API Component Group Type
 * @reference https://www.storyblok.com/docs/api/management#core-resources/component-groups/the-component-group-object
 */
type TComponentGroup = {
	id?: number
	name?: string
	uuid?: string
}
/**
 * @interface ISbContentMAPIComponentGroups
 * @description Storyblok Content Management API Component Group Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/component-groups/component-groups
 *
 **/
export interface ISbContentMAPIComponentGroups {
	component_group: TComponentGroup
	name?: string
}

// Aliases
export type ComponentGroups = ISbContentMAPIComponentGroups