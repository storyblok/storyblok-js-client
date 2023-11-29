import { version } from '../package.json'

const METHOD = {
	GET: 'get',
	DELETE: 'delete',
	POST: 'post',
	PUT: 'put',
} as const

type ObjectValues<T> = T[keyof T]
type Method = ObjectValues<typeof METHOD>

export default Method

export const STORYBLOK_AGENT = 'SB-Agent'

export const STORYBLOK_JS_CLIENT_AGENT = {
	defaultAgentName: 'SB-JS-CLIENT',
	defaultAgentVersion: 'SB-Agent-Version',
	packageVersion: version || '5.0.0',
}
