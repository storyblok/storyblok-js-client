/**
 * @interface ISBContentMAPITask
 * @description Storyblok Content Management API Task Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/tasks/tasks
 */
export interface ISBContentMAPITask {
	task: {
		id?: number
		name: string
		description?: string
		task_type?: string | 'webhook'
		last_execution?: string
		webhook_url?: string
		last_response?: string
		lamba_code?: string
	}
}

// Aliases
export type Task = ISBContentMAPITask