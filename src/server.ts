import { createServer } from 'http'
import app from './app'
import { environment, port } from './config/keys'
import Logger from './infrastructure/Logger'
import { io } from './socket'
export const server = createServer(app)
import Cache from './config/Cache'

// Attach server to socket
io.attach(server)

server
	.listen(app.get('port'), async () => {
		// Set initial value for visits
		Cache.set('visits', '0')

		console.log(`app running in ${environment} and listening on port ${port}`)
	})
	.on('error', e => Logger.error(e))

// Handle unhandled promise rejections
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (err: any) => {
	console.log(`Error: ${err.message}`)
	// Close server and exit process
	server.close(() => process.exit(1))
})

process.on('warning', e => console.warn(e.stack))
