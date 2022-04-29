import redis, { RedisClient, ClientOpts } from 'redis'
import { promisify, inspect } from 'util'
import { environment, redisHost, redisPort, redisCloudURL } from './keys'
import Logger from '../infrastructure/Logger'
import e from 'express'

// const opts: ClientOpts = {
// 	host: redisHost,
// 	port: Number(redisPort)
// }

const opts: ClientOpts = {
	host: !redisCloudURL ? redisHost : undefined,
	port: !redisCloudURL ? redisPort : undefined,
	url: redisCloudURL ?? undefined
}
interface CacheMethod {
	set(key: string, value: string): Promise<void> | void
	get(key: string): Promise<string> | string
	connect(): void
}

class Cache implements CacheMethod {
	protected cacheClient: CacheMethod

	constructor(CacheMethod: CacheMethod) {
		this.cacheClient = CacheMethod
	}

	connect() {
		this.cacheClient.connect()
	}

	set(key: string, value: string) {
		this.cacheClient.set(key, value)
	}

	get(key: string) {
		return this.cacheClient.get(key)
	}
}

class RedisCache implements CacheMethod {
	protected redisClient: RedisClient
	protected setAsync: any
	protected getAsync: any

	constructor() {
		this.redisClient = redis.createClient({ url: opts.url })
		this.setAsync = promisify(this.redisClient.set).bind(this.redisClient)
		this.getAsync = promisify(this.redisClient.get).bind(this.redisClient)
	}

	connect() {
		this.redisClient.on('ready', () => {
			Logger.info(`Redis cache connected on host ${redisHost} and on port ${redisPort}`)
		})
	}

	async set(key: string, value: string | number | boolean) {
		await this.setAsync(key, value)
	}

	async get(key: string) {
		return (await this.getAsync(key)) as string
	}
}

export default new Cache(new RedisCache())
