import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'node:http'
import { createSocket } from './sockets.js'
import { connectDatabase } from './database.js'

// config
dotenv.config()

const dbConnection = await connectDatabase()

const app = express()
app.disable('x-powered-by')
app.use(logger('dev'))

const server = createServer(app)

createSocket(server, dbConnection)

// routes
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

app.get('/styles.css', (req, res) => {
  res.sendFile(process.cwd() + '/client/styles.css')
})

// Server listening
const port = process.env.PORT ?? 3000

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
