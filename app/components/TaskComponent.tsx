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
  
  return (
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
  )
}

export default TaskComponent