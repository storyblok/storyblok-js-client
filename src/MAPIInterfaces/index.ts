/**
 * @description Exports all the Managememt API Interfaces
 *
 **/

// Activities
import { ISbContentMAPIActivity, ISbRetrieveMultipleActivitiesParams } from './MAPIActivities'
// Approvals
import {
  ISbContentMAPIApprovals,
  ISbContentMAPIReleaseApproval,
} from './MAPIApprovals'
// Assets
import { ISbAsset, ISbAssetFolder } from './MAPIAssets'
// Branch Deployments
import { ISbContentMAPIPipelineDeployments, ISbContentMAPIPipeline } from './MAPIPipelines'
// Collaborators
import {
	ISbContentMAPICollaboratorsCollection,
	ISbContentMAPICollaborator,
	ISbContentMAPICollaboratorAdd,
	ISbContentMAPICollaboratorAddWithSSO,
} from './MAPICollaborators'
// Components
import {
	ISbContentMAPIComponent,
} from './MAPIComponents'
// Component Groups
import {
	ISbContentMAPIComponentGroup,
} from './MAPIComponentGroups'
// Data Sources
import { ISbContentMAPIDataSource, ISbContentMAPIDataSourceEntry, ISbRetrieveMultipleDataSourcesParams, ISbRetrieveMultipleDataSourcesEntriesParams } from './MAPIDataSources'
// Field Types
import { ISbContentMAPIFieldTypes } from './MAPIFieldTypes'
// Presets
import { ISbContentMAPIPresets, ISbRetrieveMultiplePresetsParams } from './MAPIPresets'
// Releases
import { ISbContentMAPIReleases } from './MAPIReleases'
// Spaces
import {
  ISbContentMAPISpace,
  ISbContentMAPICreateSpace,
  ISbContentMAPIUpdateSpace,
  ISbContentMAPIDuplicateSpace,
} from './MAPISpaces'
// Spaces Roles
import {
  ISbContentMAPISpaceRoles,
} from './MAPISpacesRoles'
// Stories
import {
	ISbContentMAPIStory,
	ISbRetrieveMultipleStories,
	ISbContentMAPIUpdateStory,
} from './MAPIStories'
// Tasks
import { ISbContentMAPITask } from './MAPITasks'
// Workflow Stages
import {
	ISbContentMAPIWorkflowStage,
	ISbContentMAPIWorkflowStageChanges,
} from './MAPIWorkflowStages'

export type ISbMAPIP2Params =
  ISbContentMAPIActivity
  | ISbContentMAPIApprovals
	| ISbContentMAPIReleaseApproval
  | ISbAsset
	| ISbAssetFolder
	| ISbContentMAPIPipelineDeployments
	| ISbContentMAPIPipeline
	| ISbContentMAPICollaboratorsCollection
	| ISbContentMAPICollaborator
	| ISbContentMAPICollaboratorAdd
	| ISbContentMAPICollaboratorAddWithSSO
	| ISbContentMAPIComponent
	| ISbContentMAPIComponentGroup
	| ISbContentMAPIDataSource
  | ISbContentMAPIDataSourceEntry
	| ISbContentMAPIFieldTypes
	| ISbContentMAPIPresets
	| ISbContentMAPIReleases
	| ISbContentMAPISpace
  | ISbContentMAPICreateSpace
  | ISbContentMAPIUpdateSpace
  | ISbContentMAPIDuplicateSpace
	| ISbContentMAPISpaceRoles
	| ISbContentMAPIStory
	| ISbContentMAPIUpdateStory
	| ISbContentMAPITask
	| ISbContentMAPIWorkflowStage
	| ISbContentMAPIWorkflowStageChanges

export type ISbMAPIGETParams =
	ISbRetrieveMultipleDataSourcesParams
	| ISbRetrieveMultipleDataSourcesEntriesParams
	| ISbRetrieveMultipleStories
	| ISbRetrieveMultipleActivitiesParams
	| ISbRetrieveMultiplePresetsParams