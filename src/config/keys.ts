import * as dotenv from 'dotenv'

// Initialize dotenv
dotenv.config()

export const environment = process.env.NODE_ENV || 'development'
export const port = Number(process.env.PORT) || 5000
export const databaseURI = process.env.MONGO_URI || 'mongo://localhost:27017/khodo'
export const logDir = process.env.LOG_DIR || 'logs'

// Redis
export const redisHost = environment === 'production' ? 'redis' : 'localhost'
export const redisPort: number = Number(process.env.REDIS_PORT) || 6379
export const redisPassword = process.env.REDIS_PASSWORD || ''
export const redisCloudPassword = process.env.REDIS_CLOUD_PASSWORD || ''
export const redisCloudURL = process.env.REDIS_CLOUD_URL || `redis://${redisHost}:${redisPort}`
