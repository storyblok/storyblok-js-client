/**
 * @interface ISbContentMAPIWorkflowStage
 * @description Storyblok Content Management API Workflow Stage Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/workflow-stages/intro
 */
export interface ISbContentMAPIWorkflowStage {
	workflow_stage: {
		id?: number
		after_publish_id?: number
		allow_publish?: boolean
		is_default?: boolean
		position?: number
		allow_all_stages?: boolean
		allow_all_users?: boolean
		name: string | ''
		color?: string
		user_ids?: number[]
		space_role_ids?: number[]
		workflow_stage_ids?: number[]
	}
}

/**
 * @interface ISbContentMAPIWorkflowStageChanges
 * @description Storyblok Content Management API Workflow Stage Changes Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/workflow-stage-changes/intro
 */
export interface ISbContentMAPIWorkflowStageChanges {
	workflow_stage_change: {
		id?: number
		user_id?: number
		created_at?: string
		workflow_stage_id?: number
		story_id?: number
		with_story?: number
	}
}

/**
 * @interface ISbRetrieveMultipleWorkflowStageChangesParams
 * @description Storyblok Content Management API Retrieve Multiple Workflow Stages Params Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/workflow-stage-changes/get-all
 */
export interface ISbRetrieveMultipleWorkflowStageChangesParams {
	with_story: number
}

// Aliases
export type WorkflowStage = ISbContentMAPIWorkflowStage
export type WorkflowStageChanges = ISbContentMAPIWorkflowStageChanges
export type GetMultipleWorkflowStageChanges = ISbRetrieveMultipleWorkflowStageChangesParams