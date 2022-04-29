import express, { Express, Application, urlencoded, json, Request, Response, NextFunction } from 'express'
import compression from 'compression'
import cors from 'cors'

import Logger from './infrastructure/Logger'
import { port, environment } from './config/keys'
import Database from './config/Database'
import Cache from './config/Cache'
import { NotFoundError, InternalError, ApiError } from './infrastructure/ApiError'
import contacts from './api/routes/contacts'

process.on('uncaughtException', e => {
	Logger.error(e)
})

const app: Express = express()

app.set('port', port)

// Gzip compression to reduce file size before sending to the web browser. Reduces latency and lag
app.use(compression())

app.use(cors())

// Disable etag and x-powered-by to improve server performance
app.disable('etag').disable('x-powered-by')

app.enable('trust proxy')

// Express body parser middleware
app.use(express.json({ limit: '20mb' }))
app.use(urlencoded({ limit: '10mb', extended: false, parameterLimit: 10000 }))

app.use(json({ limit: '10mb' }))

// Connect to database
Database.connectDatabase()

// Connect to cache
Cache.connect()

// Set initial visits
// Cache.set('visits', '0')

// Index route
app.get('/api/v1', async (req: Request, res: Response) => {
	let visits = Number(await Cache.get('visits'))

	visits++

	Cache.set('visits', visits.toString())

	console.log('Visits: ' + visits)

	return res.status(200).json({
		env: environment,
		message: 'inverential peace! Jachin! Boaz!',
		visits
	})
})
// Mount routes
app.use('/api/v1/contacts', contacts)

// Catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()))

// Custom error handler for all routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof ApiError) {
		ApiError.handle(err, res)
	} else {
		if (environment === 'development') {
			Logger.error(err)
			return res.status(500).send(err.message)
		}
		ApiError.handle(new InternalError(), res)
	}
})

export default app
