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