import type { Server as SocketIo, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

type Message = {
  id: string
  username: string
  value: string
  time: number
}

type Rooms = 'JavaScript' | 'Python' | 'PHP' | 'C#' | 'Golang' | 'Ruby' | 'Java'

export const Connection = (() => {
  const rooms = {
    JavaScript: new Set<Message>(),
    Python: new Set<Message>(),
    PHP: new Set<Message>(),
    'C#': new Set<Message>(),
    Golang: new Set<Message>(),
    Ruby: new Set<Message>(),
    Java: new Set<Message>(),
  }

  const messageExpirationTimeMS = 5 * 60 * 1000

  return class ConnectionClass {
    constructor(
      private io: InstanceType<typeof SocketIo>,
      private socket: Socket
    ) {
      socket.on('getMessages', () => this.getMessages())
      socket.on('message', (value) => this.handleMessage(value))
      socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`)
      })
    }

    sendMessage(message: Message) {
      this.io.sockets.emit('message', message)
    }

    getMessages() {
      const room = this.socket.handshake.query.room as Rooms

      rooms[room].forEach((message: Message) => this.sendMessage(message))
    }

    handleMessage(value: string) {
      const username = this.socket.handshake.query?.username as string
      const room = this.socket.handshake.query.room as Rooms

      const message: Message = {
        id: uuidv4(),
        username,
        value,
        time: Date.now(),
      }

      rooms[room].add(message)
      this.sendMessage(message)

      setTimeout(() => {
        rooms[room].delete(message)

        this.io.sockets.emit('deleteMessage', message.id)
      }, messageExpirationTimeMS)
    }
  }
})()
