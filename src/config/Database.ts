import mongoose from 'mongoose'
import { databaseURI } from './keys'
import Logger from '../infrastructure/Logger'

class Database {
	database: MongoDatabase

	constructor(database: MongoDatabase) {
		this.database = database
	}

	connectDatabase() {
		this.database.connect()
	}
}

class MongoDatabase {
	connect() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		mongoose.connect(databaseURI!, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})

		mongoose.connection.on('connected', async function () {
			Logger.info('mongoose connected to ' + databaseURI)
		})

		mongoose.connection.on('disconnected', function () {
			Logger.error('mongoose disconnected')
		})

		mongoose.connection.on('error', function (err) {
			Logger.error('mongoose connection error ' + err)
		})

		process.on('SIGINT', function () {
			mongoose.connection.close(function () {
				Logger.error('mongoose disconnected through app termination!')
				process.exit(0)
			})
		})

		process.on('SIGTERM', function () {
			mongoose.connection.close(function () {
				Logger.error('mongoose disconnected through app termination!')
				process.exit(0)
			})
		})

		process.once('SIGUSR2', function () {
			mongoose.connection.close(function () {
				Logger.error('mongoose disconnected through app termination!')
				process.kill(process.pid, 'SIGUSR2')
			})
		})
	}
}

export default new Database(new MongoDatabase())
