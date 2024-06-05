"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import "@/app/globals.css"
import { Task } from "@/models/enum/Task"
import { isSameDay, timeLeft } from "../utils/lib"
import { Dispatch, SetStateAction } from "react"

function TaskComponent({ refreshTasks, task, setLoading }: { refreshTasks: Function, task: Task, setLoading: Dispatch<SetStateAction<boolean>> }) {
  const { push } = useRouter()
  const isToday = isSameDay(task.updated_at!)

  const navigateTo = (id: number) => {
    push(`/tasks/${id}`)
  }

  const changeCompletedTo = async (newValue: boolean) => {
    setLoading(true)
    task.completed = newValue
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    setLoading(false)
    refreshTasks()
  }

  const handleClassName = () => {
    if (task.completed) {
      return "border-gray-400 bg-gray-400"
    }

    if (isToday) {
      return "border-gray-500 bg-gray-500"
    }

    return "border-red-400 bg-red-400"
  }

  const handleDelete = async () => {
    setLoading(true)
    await fetch('/api/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: task.id }),
    })
    setLoading(false)
    refreshTasks()
  }
  
  return (
    <div className="border-red-400 group flex justify-between items-center">
      {/* Left */}
      <div className="pl-1 flex items-center cursor-pointer hover:text-gray-700">
        {/* Left */}
        <div>
          {task.completed
            ? <Image
              width={14}
              height={14}
              className=""
              src="/check.png"
              alt="task is completed icon"
              onClick={() => changeCompletedTo(false)}
            />
            : <Image
              width={14}
              height={14}
              className=""
              src="/circle.png"
              alt="task not completed icon"
              onClick={() => changeCompletedTo(true)}
            />}
        </div>
        {/* Right */}
        <div className="pl-3" onClick={() => navigateTo(task.id!)}>
          {task.title}
          <div className={"w-max text-xs px-2 py-1 rounded-lg text-white border " + (handleClassName())}>{timeLeft(task.updated_at as string)}</div>
        </div>
      </div>
      
      {/* Right */}
      <svg className="hidden group-hover:block size-5 text-gray-500 hover:text-gray-700 cursor-pointer transition transform" onClick={handleDelete} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    </div>
  )
}

export default TaskComponent