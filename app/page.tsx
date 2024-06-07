"use client"

import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

import "@/app/globals.css"
import TaskComponent from './components/TaskComponent'
import { Task } from '@/models/enum/Task'
import { Loading } from './components/loading'
import JWT from 'jsonwebtoken'
import { getToken } from './utils/lib'

function EmptyTask({ message }: { message: string }) {
  return (
    <>
      <Image
        className="m-auto"
        src="/empty.png"
        width={84}
        height={84}
        alt="no task created icon"
      />
      <p className="font-lg text-center mt-2 text-gray-800">{message}</p>
    </>
  )
}

export default function Home() {
  const [token, setToken] = useState<string>()
  const [username, setUsername] = useState<string>()
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksFiltered, setTasksFiltered] = useState<Task[]>([])
  
  const [isLoading, setLoading] = useState(true)
  const [isInititated, setInititated] = useState(false)
  const [isModalSelected, setModalSelected] = useState(false)

  // nav
  const { push } = useRouter()

  useEffect(() => {
    if (!isInititated) {
      const { token, success } = getToken(document.cookie)
      if (!success) {
        redirect("/login")
      }

      const payload = JWT.decode(token) as JWT.JwtPayload
      
      setUsername(payload.username)
      setToken(token)

      // get tasks
      const asyncFunc = async () => {
        const response = await fetch(`/api/tasks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        })
        const { data } = await response.json()
        
        setTasks(data)
        setTasksFiltered(data)
        
        setLoading(false)
        setInititated(true)
      }
      asyncFunc()
    }
  }, [isInititated])

  const handleLogout = () => {
    document.cookie = "userId=;SameSite=None; Secure"
    push("/login")
  }

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchElement: HTMLInputElement = document.querySelector('#search')!
    const search = searchElement.value

    if (!isInititated) {
      return
    }

    if (search === "") {
      setTasksFiltered(tasks)
    } else {
      const filtered = tasks.filter(t => t.title.includes(search))
      setTasksFiltered(filtered)
    }
  }

  const refreshTasks = async () => {
    setLoading(true)

    const response = await fetch(`/api/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    })
    const { data } = await response.json()
    
    setTasks(data)
    setTasksFiltered(data)

    setLoading(false)
  }

  const renderActiveTasks = () => {
    if (isLoading) {
      return <>
        <div className="m-auto grid justify-items-center items-center z-20 opacity-40">
          <Loading />
        </div>
      </>
    } else {
      const activeTasks = tasksFiltered.filter(t => !t.completed).sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
      if (activeTasks.length > 0) {
        return (
          <div className="grid gap-2">
            {activeTasks.map((el, i) => (
              <TaskComponent key={el.id} task={el} refreshTasks={refreshTasks} setLoading={setLoading} />
            ))}
          </div>
        )
      } else {
        return <EmptyTask message="Task is empty." />
      }
    }
  }

  const renderCompletedTasks = () => {
    if (isLoading) {
      return <>
        <div className="m-auto grid justify-items-center items-center z-20 opacity-40">
          <Loading />
        </div>
      </>
    } else {
      const completedTasks = tasksFiltered.filter(t => t.completed).sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
      if (completedTasks.length > 0) {
        return (
          <div className="grid gap-2">
            {completedTasks.map((el, i) => (
              <TaskComponent key={el.id} task={el} refreshTasks={refreshTasks} setLoading={setLoading} />
            ))}
          </div>
        )
      } else {
        return <EmptyTask message="No task completed yet." />
      }
    }
  }

  return (
    <div className="bg-slate-200 min-h-screen" onClick={() => isModalSelected && setModalSelected(false)}>
      {!isInititated && <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
        <div className="absolute bg-white w-full h-full"></div>
        <Loading />
        <div className="absolute bg-white/40 w-full h-full"></div>
      </div>}
      <main className="w-2/3 m-auto">
        <nav className="flex justify-between pt-4 pb-2 px-4">
          <div className="flex items-center cursor-pointer" onClick={() => push('/')}>
            <Image
              className="m-auto"
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
              <button onClick={() => push(`/${username}`)} className="pl-2 w-36 h-8 hover:bg-black text-left text-white transition transform">Profile</button>
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
              onClick={() => push(`/tasks/new`)}>
              + Create
            </button>
          </div>

          {/* Middle */}
          <div className="bg-white h-max w-6/12 pt-2 pb-8 px-4 rounded-sm">
            <h2 className="font-bold">My Task</h2>
            <div className="flex gap-2 w-max pr-2 text-blue-600 hover:text-blue-900 mt-2 cursor-pointer transition transform" onClick={() => push(`/tasks/new`)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Add a task
            </div>
            <div className="mt-2"></div>
            {renderActiveTasks()}
            <h2 className="font-bold mt-2">Completed</h2>
            <div className="mt-2"></div>
            {renderCompletedTasks()}
          </div>
        </div>

        {/* Right */}
        <div className="w-3/12"></div>
      </main>
    </div>
  );
}
