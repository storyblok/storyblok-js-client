/**
 * @description Exports all the Managememt API Interfaces
 *
 **/

// Activities
import { ISBContentMAPIActivity } from './MAPIActivities'
// Approvals
import {
  ISBContentMAPIApprovals,
  ISBContentMAPIReleaseApproval,
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
import { ISBContentMAPIFieldTypes } from './MAPIFieldTypes'
// Presets
import { ISBContentMAPIPresets } from './MAPIPresets'
// Releases
import { ISbContentMAPIReleases } from './MAPIReleases'
// Spaces
import {
  ISBContentMAPISpace,
  ISBContentMAPICreateSpace,
  ISBContentMAPIUpdateSpace,
  ISBContentMAPIDuplicateSpace,
} from './MAPISpaces'
// Spaces Roles
import {
  ISBContentMAPISpaceRoles,
} from './MAPISpacesRoles'
// Stories
import {
	ISbContentMAPIStory,
	ISbContentMAPIGetMultipleStories,
	ISbContentMAPICreateStory,
	ISbContentMAPIUpdateStory,
} from './MAPIStories'
// Tasks
import { ISBContentMAPITask } from './MAPITasks'
// Workflow Stages
import {
	ISbContentMAPIWorkflowStage,
	ISbContentMAPIWorkflowStageChanges,
} from './MAPIWorkflowStages'

export type ISbMAPICUDParams =
  ISBContentMAPIActivity
  | ISBContentMAPIApprovals
	| ISBContentMAPIReleaseApproval
  | ISbAsset
	| ISbAssetFolder
	| ISbContentMAPIBranchDeployments
	| ISbContentMAPIComponent
	| ISbContentMAPIComponentGroup
	| ISbContentMAPIDataSource
  | ISbContentMAPIDataSourceEntry
	| ISBContentMAPIFieldTypes
	| ISBContentMAPIPresets
	| ISbContentMAPIReleases
	| ISBContentMAPISpace
  | ISBContentMAPICreateSpace
  | ISBContentMAPIUpdateSpace
  | ISBContentMAPIDuplicateSpace
	| ISBContentMAPISpaceRoles
	| ISbContentMAPIStory
	| ISbContentMAPICreateStory
	| ISbContentMAPIUpdateStory
	| ISBContentMAPITask
	| ISbContentMAPIWorkflowStage
	| ISbContentMAPIWorkflowStageChanges

export type ISbMAPIGETParams =
	ISbRetrieveMultipleDataSourcesParams
	| ISbRetrieveMultipleDataSourcesEntriesParams
	| ISbContentMAPIGetMultipleStories