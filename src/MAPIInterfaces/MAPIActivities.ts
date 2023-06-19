/**
 * Interface for MAPI Activities
 * @interface ISbContentMAPIActivity
 * @description Storyblok Content Management API Activity Interface
 * @reference https://www.storyblok.com/docs/api/management#core-resources/activities/activities
 */
export interface ISbContentMAPIActivity {
	activity: {
		id?: number
		trackable_id?: number
		trackable_type?: string
		owner_id?: number
		owner_type?: string
		key?: string
		parameters?: object
		recipient_id?: number
		recipient_type?: string
		created_at?: string
		updated_at?: string
		space_id?: number
	}
}

/**
 * @interface ISbRetrieveMultipleActivitiesParams
 * @description Storyblok Content Management API Activity Interface to retrieve multiple activities
 * @reference http://localhost:3000/docs/api/management/v1/#core-resources/activities/retrieve-multiple-activities
 */
export interface ISbRetrieveMultipleActivitiesParams {
	created_at_gte: string
	created_at_lte: string
}

// Alias for ISbContentMAPIActivity
export type Activity = ISbContentMAPIActivity

// Alias for ISbRetrieveMultipleActivitiesParams
export type GetActivities = ISbRetrieveMultipleActivitiesParams
