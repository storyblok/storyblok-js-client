/**
 * @description Exports all the Managememt API Interfaces
 *
 **/

// Activities
import {
	ISbContentMAPIActivities,
	ISbRetrieveMultipleActivitiesParams,
} from './MAPIActivities'
// Approvals
import {
	ISbContentMAPIApprovals,
	ISbContentMAPIReleaseApprovals,
	ISbRetrieveMultipleApprovalsParams,
} from './MAPIApprovals'
// Assets
import {
	ISbAssets,
	ISbAssetFolders,
	ISbRetrieveMultipleAssets,
} from './MAPIAssets'
// Branch Deployments
import {
	ISbContentMAPIPipelineDeployments,
	ISbContentMAPIPipelines,
} from './MAPIPipelines'
// Collaborators
import {
	ISbContentMAPICollaboratorsCollection,
	ISbContentMAPICollaborator,
	ISbContentMAPICollaboratorAdd,
	ISbContentMAPICollaboratorAddUsersWithSSO,
} from './MAPICollaborators'
// Components
import { ISbContentMAPIComponents } from './MAPIComponents'
// Component Groups
import { ISbContentMAPIComponentGroups } from './MAPIComponentGroups'
// Data Sources
import {
	ISbContentMAPIDataSources,
	ISbContentMAPIDataSourceEntries,
	ISbRetrieveMultipleDataSourcesParams,
	ISbRetrieveMultipleDataSourcesEntriesParams,
} from './MAPIDataSources'
// Field Types
import { ISbContentMAPIFieldTypes } from './MAPIFieldTypes'
// Presets
import {
	ISbContentMAPIPresets,
	ISbRetrieveMultiplePresetsParams,
} from './MAPIPresets'
// Releases
import { ISbContentMAPIReleases } from './MAPIReleases'
// Spaces
import {
	ISbContentMAPISpaces,
	ISbContentMAPICreateSpace,
	ISbContentMAPIUpdateSpace,
	ISbContentMAPIDuplicateSpace,
} from './MAPISpaces'
// Spaces Roles
import {
	ISbContentMAPISpaceRoles,
	ISbContentMAPISpaceRolesCreate,
	ISbContentMAPISpaceRolesUpdate,
} from './MAPISpacesRoles'
// Stories
import {
	ISbContentMAPIStories,
	ISbRetrieveMultipleStories,
	ISbContentMAPIUpdateStory,
} from './MAPIStories'
// Tasks
import { ISbContentMAPITasks } from './MAPITasks'
// Workflow Stages
import {
	ISbContentMAPIWorkflowStages,
	ISbContentMAPIWorkflowStageChanges,
	ISbRetrieveMultipleWorkflowStageChangesParams,
} from './MAPIWorkflowStages'

export type ISbMAPIP2Params =
	| ISbContentMAPIActivities
	| ISbContentMAPIApprovals
	| ISbContentMAPIReleaseApprovals
	| ISbAssets
	| ISbRetrieveMultipleAssets
	| ISbAssetFolders
	| ISbContentMAPIPipelineDeployments
	| ISbContentMAPIPipelines
	| ISbContentMAPICollaboratorsCollection
	| ISbContentMAPICollaborator
	| ISbContentMAPICollaboratorAdd
	| ISbContentMAPICollaboratorAddUsersWithSSO
	| ISbContentMAPIComponents
	| ISbContentMAPIComponentGroups
	| ISbContentMAPIDataSources
	| ISbContentMAPIDataSourceEntries
	| ISbContentMAPIFieldTypes
	| ISbContentMAPIPresets
	| ISbContentMAPIReleases
	| ISbContentMAPISpaces
	| ISbContentMAPICreateSpace
	| ISbContentMAPIUpdateSpace
	| ISbContentMAPIDuplicateSpace
	| ISbContentMAPISpaceRoles
	| ISbContentMAPISpaceRolesCreate
	| ISbContentMAPISpaceRolesUpdate
	| ISbContentMAPIStories
	| ISbContentMAPIUpdateStory
	| ISbContentMAPITasks
	| ISbContentMAPIWorkflowStages
	| ISbContentMAPIWorkflowStageChanges

export type ISbMAPIGETParams =
	| ISbRetrieveMultipleDataSourcesParams
	| ISbRetrieveMultipleDataSourcesEntriesParams
	| ISbRetrieveMultipleStories
	| ISbRetrieveMultipleActivitiesParams
	| ISbRetrieveMultiplePresetsParams
	| ISbRetrieveMultipleApprovalsParams
	| ISbRetrieveMultipleWorkflowStageChangesParams
