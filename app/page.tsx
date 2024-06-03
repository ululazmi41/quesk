"use client"

import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react';

import "@/app/globals.css"

export default function Home() {
  const [isModalSelected, setModalSelected] = useState(false)
  const [id, setId] = useState("")
  const { push } = useRouter()

  const placeholderId = "1"

  useEffect(() => {
    const cookie = document.cookie
    if (cookie === "") {
      redirect("/login")
    } else {
      const userId = cookie.split('=')[1]
      if (userId === "") {
        redirect("/login")
      } else {
        setId(userId)
      }
    }
  }, [])

  const handleLogout = () => {
    document.cookie = "userId=;SameSite=None; Secure"
    push("/login")
  }

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchElement: HTMLInputElement = document.querySelector('#search')!
    const search = searchElement.value

    console.log(search)
  }

  const navigateTask = (id?: string) => {
    console.log(id)
    if (id) {
      push(`/task/${id}`)
    } else {
      push('/task')
    }
  }

  return (
    <div className="bg-slate-200 min-h-screen" onClick={() => isModalSelected && setModalSelected(false)}>
      <main className="w-2/3 m-auto">
        <nav className="flex justify-between pt-4 pb-2 px-4">
          <div className="flex items-center">
            <Image
              className="m-auto cursor-pointer"
              onClick={() => push("/")}
              src="/notes.png"
              width={24}
              height={24}
              alt="brand icon"
            />
            <h1 className="text-lg font-semibold text-black ml-4">Quesk</h1>
          </div>
          <div className="relative">
            <Image
              className="m-auto cursor-pointer"
              onClick={() => setModalSelected(true)}
              src="/user.png"
              width={28}
              height={28}
              alt="user icon"
            />
            <div className={(isModalSelected ? "block" : "hidden") + " absolute bg-[#666666] w-36 mt-2"}>
              <button onClick={() => push(`/${id}`)} className="pl-2 w-36 h-8 hover:bg-black text-left text-white transition transform">Profile</button>
              <button onClick={handleLogout} className="pl-2 pb-1 w-36 h-8 hover:bg-black text-left text-white transition transform">Logout</button>
            </div>
          </div>
        </nav>
        <div className="flex mt-8">
          {/* Left */}
          <div className="w-3/12 px-4">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Image
                  className=""
                  src="/search.png"
                  width={14}
                  height={14}
                  alt="search icon"
                />
              </div>
              <input className="block p-2 ps-10 text-sm text-gray-700 border shadow appearance-none rounded w-full py-2 px-3 mb-3 leading-tight focus:shadow-outline" id="search" type="text" placeholder="search" onChange={onSearch} />
            </div>
            <button
              className="border rounded-md cursor-pointer bg-black text-white hover:bg-gray-700 pt-1 pb-2 pl-3 pr-4 w-max transition transform"
              onClick={() => navigateTask()}>
              + Create
            </button>
          </div>

          {/* Middle */}
          <div className="bg-white h-max w-6/12 pt-2 pb-8 px-4 rounded-sm">
            <h2 className="font-bold">My Task</h2>
            <div className="flex gap-2 w-max pr-2 text-blue-600 hover:text-blue-900 mt-2 cursor-pointer transition transform" onClick={() => navigateTask()}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Add a task
            </div>
            <div className="mt-2"></div>
            <div className="pl-1 flex items-center cursor-pointer hover:text-gray-700" onClick={() => navigateTask(placeholderId)}>
              {/* Left */}
              <div>
                <Image
                  className=""
                  src="/circle.png"
                  width={14}
                  height={14}
                  alt="task not completed icon"
                />
              </div>
              {/* Right */}
              <div className="pl-3">
                Title
              </div>
            </div>
            <h2 className="font-bold mt-2">Completed</h2>
            <div className="mt-2"></div>
            <Image
              className="m-auto"
              src="/empty.png"
              width={84}
              height={84}
              alt="no task completed icon"
            />
            <p className="font-lg text-center mt-2 text-gray-800">No task completed yet.</p>
          </div>

          {/* Right */}
          <div className="w-3/12"></div>
        </div>
      </main>
    </div>
  );
}
