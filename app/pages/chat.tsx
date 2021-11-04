/* eslint-disable react/jsx-key */
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ChangeEvent, Children, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

type Message = {
  id: string
  username: string
  value: string
  time: number
}

const Chat: NextPage = () => {
  const router = useRouter()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Record<string, Message>>({})
  const [newMessage, setNewMessage] = useState('')
  const room = router.query.room as string
  const username = router.query.username as string

  useEffect(() => {
    let newSocket: Socket

    if (room) {
      newSocket = io('ws://localhost:3001/', {
        query: { room, username },
      })

      setSocket(newSocket)
    }

    return () => {
      newSocket?.close()
    }
  }, [room, username])

  useEffect(() => {
    const messageListener = (message: Message) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages }

        newMessages[message.id] = message

        return newMessages
      })
    }

    const deleteMessageListener = (id: string) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages }

        delete newMessages[id]

        return newMessages
      })
    }

    socket?.on('message', messageListener)
    socket?.on('deleteMessage', deleteMessageListener)
    socket?.emit('getMessages')

    return () => {
      socket?.off('message', messageListener)
      socket?.off('deleteMessage', deleteMessageListener)
    }
  }, [socket])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setNewMessage(value)
  }

  const handleSubmit = () => {
    if (newMessage) {
      socket?.emit('message', newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col w-full h-auto min-h-screen mx-auto bg-gray-300 sm:w-2/3">
      <div className="w-full p-6 bg-gray-400">
        <h1 className="text-3xl text-gray-900 ">{room} Chatroom</h1>
      </div>

      <div className="flex-grow w-full p-6 overflow-y-auto">
        {socket
          ? Children.toArray(
              [...Object.values(messages)]
                .sort((a, b) => a.time - b.time)
                .map((message) => (
                  <div className="block w-auto my-2">
                    <span className="user">{message.username}</span>
                    <div className="w-auto max-w-md p-2 bg-gray-400 rounded">
                      <span className="block mb-1 text-lg">
                        {message.value}
                      </span>
                      <span className="block text-xs">
                        {new Date(message.time).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
            )
          : 'Connecting...'}
      </div>

      <div className="w-full px-4 py-2 bg-gray-400">
        <div className="grid grid-cols-6 gap-s4">
          <div className="col-span-6 sm:col-span-5">
            <input
              type="text"
              name="message"
              id="message"
              placeholder="Type in your message..."
              className="block w-full p-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newMessage}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-6 sm:col-span-1">
            <button
              onClick={handleSubmit}
              className="inline-flex justify-center w-full py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
