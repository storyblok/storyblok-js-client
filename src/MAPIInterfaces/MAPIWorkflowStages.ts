export interface ISbContentMAPIWorkflowStage {
	id: number
	after_publish_id?: number
	allow_publish?: boolean
	is_default?: boolean
	position?: number
	allow_all_stages?: boolean
	allow_all_users?: boolean
	name?: string
	color?: string
	user_ids?: number[]
	space_role_ids?: number[]
	workflow_stage_ids?: number[]
}

export interface ISbContentMAPIWorkflowStageChanges {
	id: number
	user_id: number
	created_at: string
	workflow_stage_id: number
}
