import Redis from 'ioredis'
import { ISbResult } from '../../src/interfaces'

const client = new Redis()

const KEY_PREFIX = 'sb:'

export const get = async (key: string) => {
	const content = await client.get(KEY_PREFIX + key)
	return content ? JSON.parse(content) : null
}
export const getAll = async () => {}

export const set = async (key: string, content: ISbResult) => {
	await client.set(KEY_PREFIX + key, JSON.stringify(content));
}

export const flush = async () => {
	client.keys(`${KEY_PREFIX}*`).then((keys) => {
		const pipeline = client.pipeline();
		keys.forEach(function (key) {
			pipeline.del(key);
		});
		return pipeline.exec();
	})
}
