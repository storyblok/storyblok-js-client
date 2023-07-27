/**
 * @interface ISbContentMAPIApprovals
 * @description This interface is generated from the API endpoint for approvals
 * @reference https://www.storyblok.com/docs/api/management#core-resources/approvals/approvals
 */
export interface ISbContentMAPIApprovals {
	approval: {
		id?: number
		status?: string
		story_id?: number
		approver_id?: number
	}
}

/**
 * @interface ISbContentMAPIReleaseApprovals
 * @description This interface is generated from the API endpoint for release approvals
 * @reference https://www.storyblok.com/docs/api/management#core-resources/approvals/release-approvals
 */
export interface ISbContentMAPIReleaseApprovals extends ISbContentMAPIApprovals {
	release_id: number
}

/**
 * @interface ISbRetrieveMultipleApprovalsParams
 * @description This interface is generated from the API endpoint for retrieving multiple approvals
 * @reference https://www.storyblok.com/docs/api/management/v1/#core-resources/approvals/retrieve-multiple-approvals
 */
export interface ISbRetrieveMultipleApprovalsParams {
	approver?: number
}

// Aliases
export type Approvals = ISbContentMAPIApprovals
export type ReleaseApprovals = ISbContentMAPIReleaseApprovals
export type GetApprovals = ISbRetrieveMultipleApprovalsParams