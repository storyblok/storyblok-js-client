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
import { ISbContentMAPIBranchDeployments } from './MAPIBranchDeployments'
// Components
import {
	ISbContentMAPIComponent,
	ISbContentMAPIComponentGroup,
} from './MAPIComponents'
// Data Sources
import { ISbContentMAPIDataSource, ISbContentMAPIDataSourceEntry, ISbRetrieveMultipleDataSourcesParams, ISbRetrieveMultipleDataSourcesEntriesParams } from './MAPIDataSources'
// Field Types
import { ISbContentMAPIFieldTypes } from './MAPIFieldTypes'
// Presets
import { ISbContentMAPIPresets } from './MAPIPresets'
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
	ISbContentMAPICreateStory,
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
	| ISbContentMAPIBranchDeployments
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
	| ISbContentMAPICreateStory
	| ISbContentMAPIUpdateStory
	| ISbContentMAPITask
	| ISbContentMAPIWorkflowStage
	| ISbContentMAPIWorkflowStageChanges

export type ISbMAPIGETParams =
	ISbRetrieveMultipleDataSourcesParams
	| ISbRetrieveMultipleDataSourcesEntriesParams
	| ISbRetrieveMultipleStories
	| ISbRetrieveMultipleActivitiesParams