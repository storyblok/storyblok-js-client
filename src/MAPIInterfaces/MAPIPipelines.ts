/**
 * @interface ISbContentMAPIPipeline
 * @description Storyblok Content Management API Pipeline Interface
 * @reference https://www.storyblok.com/docs/api/managemen#core-resources/pipelines/object
 */
export interface ISbContentMAPIPipeline {
	branch: {
		id?: number
		name: string
		space_id?: number
		deleted_at?: null
		created_at?: string
		updated_at?: string
		source_id?: number
		deployed_at?: string
		url?: string
		position?: number
	}
}

/**
 * Interface for the Pipeline Deployments API
 * @interface ISbContentMAPIPipelineDeployments
 * @description Storyblok Content Management API Pipeline Deployments Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/pipelines/pipeline-deployment
 */
export interface ISbContentMAPIPipelineDeployments {
	branch_id: number
	release_uuids: string[]
}

// Aliases
export type Pipeline = ISbContentMAPIPipeline
export type PipelineDeployment = ISbContentMAPIPipelineDeployments