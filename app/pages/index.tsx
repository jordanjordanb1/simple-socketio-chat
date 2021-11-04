import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ChangeEvent, MouseEvent, useState } from 'react'

const Home: NextPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    room: 'JavaScript',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const field = e.target.name
    const value = e.target.value

    setForm((prev) => ({
      ...prev,
      [`${field}`]: value,
    }))
  }

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (form.username && form.room) {
      router.push({
        pathname: '/chat',
        query: form,
      })
    }
  }

  return (
    <div className="container py-4 mx-auto md:px-1">
      <div className="flex flex-col justify-center w-full gap-4 px-4 py-4 mx-auto bg-gray-300 rounded md:w-1/2 lg:w-1/3">
        <h1 className="w-full text-3xl text-center text-gray-700">CHAT</h1>

        <div className="w-full h-[2px] bg-gray-400 rounded opacity-50" />

        <div className="flex flex-col justify-center w-full gap-6">
          <div className="flex flex-col w-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter a username..."
              value={form.username}
              onChange={handleChange}
              className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="room"
              className="block text-sm font-medium text-gray-700"
            >
              Room
            </label>
            <select
              name="room"
              id="room"
              className="h-full p-2 text-gray-500 border-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-7 sm:text-sm"
              value={form.room}
              onChange={handleChange}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Golang">Golang</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Join Chat
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
