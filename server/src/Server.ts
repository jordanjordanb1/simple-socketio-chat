import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import http from 'http'
import morgan from 'morgan'
import path from 'path'
import { Server as SocketIo } from 'socket.io'
import { Connection } from './Connection'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const staticDir = path.join(__dirname, 'public')
app.use(express.static(staticDir))

const server = http.createServer(app)
const io = new SocketIo(server, {
  cors: {
    origin: '*',
  },
})

io.sockets.on('connect', (socket) => {
  new Connection(io, socket)
})

export default server
