/**
 * @interface ISBContentMAPIApprovals
 * @description This interface is generated from the API endpoint for approvals
 * @reference https://www.storyblok.com/docs/api/management#core-resources/approvals/approvals
 */
export interface ISBContentMAPIApprovals {
	approval: {
		id?: number
		status: string
		story_id: number
		approver_id: number
	}
}

export interface ISBContentMAPIReleaseApproval extends ISBContentMAPIApprovals {
	release_id: number
}

// Aliases
export type Approval = ISBContentMAPIApprovals
export type ReleaseApproval = ISBContentMAPIReleaseApproval