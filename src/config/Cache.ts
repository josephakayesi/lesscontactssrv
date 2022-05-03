import { createClient } from 'redis'
import { promisify } from 'util'
import { redisHost, redisPort, redisCloudURL } from './keys'
import Logger from '../infrastructure/Logger'

const opts = {
	url: redisCloudURL ?? undefined
}

// const redisClient = createClient({ url: opts.url, legacyMode: true })

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
	protected redisClient: any
	protected setAsync: any
	protected getAsync: any

	constructor() {
		this.redisClient = createClient({ url: opts.url, legacyMode: true })
		this.setAsync = promisify(this.redisClient.set).bind(this.redisClient)
		this.getAsync = promisify(this.redisClient.get).bind(this.redisClient)
	}

	async connect() {
		await this.redisClient.connect()
		console.log(`redis cache connected on host ${redisHost} and on port ${redisPort}`)

		Logger.info(`redis cache connected on host ${redisHost} and on port ${redisPort}`)
	}

	async set(key: string, value: string | number | boolean) {
		await this.setAsync(key, value)
	}

	async get(key: string) {
		return (await this.getAsync(key)) as string
	}
}

export default new Cache(new RedisCache())
