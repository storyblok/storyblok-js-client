import { StoryblokComponent } from '../../../../node_modules/storyblok-js-client/types/index'

export interface IResponse {
  status: number,
  statusText: string,
}

export interface IError {
  message: Error,
  response: IResponse,
}

export interface IParams {
  version: string,
  filter_query?: object,
  resolve_assets?: number,
  resolve_links?: string,
  resolve_relations?: string,
  token: string,
  cv?: number,
  page?: number,
  per_page?: number
  sort_by?: string,
}

export interface INode extends Element {
	attrs: {
		anchor?: string,
    body: Array<StoryblokComponent<any>>,
		href?: string,
		level?: number,
		linktype?: string,
	},
}

export type NodeSchema = {
	(node: INode): object
}

export type MarkSchema = {
	(node: INode): object
}

export interface ISchema {
	nodes: any,
	marks: any,
	(arg: IRichtext): any
}

export interface IRichtext {
  content: []
  marks: []
  text: string
  type: string
}

export type ThrottleFn = {
  (...args: any): any
}