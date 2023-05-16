export interface ISbContentMAPIBranchDeployments {
	branch_id: number
	release_uuids: string[]
}

// Aliases
export type BranchDeployment = ISbContentMAPIBranchDeployments