/**
 * Interface for the Branch Deployments API
 * @interface ISbContentMAPIBranchDeployments
 * @description Storyblok Content Management API Branch Deployments Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/deployments/intro
 */
export interface ISbContentMAPIBranchDeployments {
	branch_id: number
	release_uuids: string[]
}

// Aliases
export type BranchDeployment = ISbContentMAPIBranchDeployments