const METHOD = {
	GET: 'get',
	DELETE: 'delete',
	POST: 'post',
	PUT: 'put',
} as const

type ObjectValues<T> = T[keyof T]
type Method = ObjectValues<typeof METHOD>

export default Method
