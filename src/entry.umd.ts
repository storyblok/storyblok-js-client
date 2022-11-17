import Client from './index'
import RichtextResolver from './richTextResolver'
import SbFetch from './sbFetch'
import RichTextSchema from './schema'
import * as sbHelpers from './sbHelpers'

const extend = (to: Record<any, any>, _from: Record<any, any>) => {
	for (const key in _from) to[key] = _from[key]
}

extend(Client, { RichtextResolver, SbFetch, RichTextSchema })
extend(Client, sbHelpers)

// Single default export object for UMD friendly bundle
export default Client
