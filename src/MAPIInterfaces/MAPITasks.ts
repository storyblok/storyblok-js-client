/**
 * @interface ISbContentMAPITasks
 * @description Storyblok Content Management API Task Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/tasks/tasks
 */
export interface ISbContentMAPITasks {
	task: {
		id?: number
		name?: string
		description?: string
		task_type?: string | 'webhook'
		last_execution?: string
		webhook_url?: string
		last_response?: string
		lambda_code?: string
	}
}

// Aliases
export type Tasks = ISbContentMAPITasks
