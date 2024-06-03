"use client"

import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import "@/app/globals.css"
import { Task } from '@/models/enum/Task';
import { Loading } from '../components/loading';

const NoteNotFound = () => {
  return (
    <div className="bg-white h-max w-max pt-2 pb-8 px-16 rounded-lg m-auto">
      <Image
        className="m-auto my-4"
        src="/warning.png"
        width={100}
        height={100}
        alt="note not found icon"
      />
      <p className="text-center font-bold text-lg">Note not found</p>
    </div>
  )
}

export default function Home({ params }: { params: { id: string } }) {
  // Task
  const [id, setId] = useState("")
  const [userId, setUserId] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [completed, setCompleted] = useState(false)
  const [updatedAt, setUpdatedAt] = useState((new Date()).toISOString())

  const [isLoading, setLoading] = useState(true)
  const [isNotFound, setNotFound] = useState(false)
  const [isInitiated, setInitiated] = useState(false)
  const [isContentEdited, setContentEdited] = useState(false)
  const [isModalSelected, setModalSelected] = useState(false)
  const { push } = useRouter()

  useEffect(() => {
    if (isInitiated && !isNotFound) {
      const descriptionWrapperElement: HTMLTextAreaElement = document.querySelector('#descriptionWrapper')!
      descriptionWrapperElement.dataset.clonedVal = description
    }

    const cookie = document.cookie
    if (cookie === "") {
      redirect("/login")
    } else {
      const userId = cookie.split('=')[1]
      if (userId === "") {
        redirect("/login")
      } else {
        // TODO: check if user id is identical, else, show 404 page
        setUserId(userId)

        if (isInitiated === false) {
          if (params.id === "new") {
            setInitiated(true)
            setLoading(false)
          } else {
            const asyncFunc = async () => {
              const response = await fetch(`/api/tasks/${parseInt(params.id)}`)
              const { success, data } = await response.json()
              if (success) {
                setId(data["id"])
                setTitle(data["title"])
                setCompleted(data["completed"])
                setUpdatedAt(data["updated_at"])
                setDescription(data["description"])

                setInitiated(true)
                console.log(params.id, id, userId, title, description, completed, updatedAt)
              } else {
                setNotFound(true)
                setInitiated(true)
              }
              setLoading(false)
            }
            asyncFunc()
          }
        }
      }
    }
  }, [isInitiated, isNotFound, params.id, id, userId, title, description, completed, updatedAt])

  const handleLogout = () => {
    document.cookie = "userId=;SameSite=None; Secure"
    push("/login")
  }

  const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (isContentEdited === false) {
      setContentEdited(true)
    }
  }

  const onDescriptionChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const descriptionWrapperElement: HTMLTextAreaElement = document.querySelector('#descriptionWrapper')!
    descriptionWrapperElement.dataset.clonedVal = e.target.value
    setDescription(e.target.value)
    if (isContentEdited === false) {
      setContentEdited(true)
    }
  }

  const showFormattedDate = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }

    return new Date(date).toLocaleDateString("en-EN", options)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const task: Task = {
      id,
      user_id: userId,
      title,
      description,
      completed,
    }
    await fetch('/api/tasks', {
      method: params.id === 'new' ? 'POST': 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    push('/')
  }

  const handleSubmitWrapper = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit()
  }

  const wrapper = () => {
    if (!isInitiated) {
      return <></>
    }

    if (isNotFound) {
      return <></>
    }

    return (
      <div className="flex mt-8">
        {/* Left */}
        <div className="w-2/12"></div>

        {/* Middle */}
        <form className="bg-white h-max w-8/12 pt-2 pb-8 px-4 rounded-sm" onSubmit={handleSubmitWrapper}>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            className="text-xl font-bold outline-none hover:outline-none w-full text-ellipsis"
            placeholder="Title"
            onChange={onTitleChangeHandler}
            readOnly={completed}
            required
          />
          <div className="flex justify-between mt-1">
            <p id="date" className='text-sm text-gray-400'>{showFormattedDate(updatedAt)}</p>
            {completed && <div className="w-max text-xs px-2 py-1 rounded-lg text-white border border-yellow-600 bg-yellow-400">Completed</div>}
          </div>
          <div className="
                grid
                text-sm
                after:px-3.5
                after:py-2.5
                [&>textarea]:text-inherit
                after:text-inherit
                [&>textarea]:resize-none
                [&>textarea]:overflow-hidden
                [&>textarea]:[grid-area:1/1/2/2]
                after:[grid-area:1/1/2/2]
                after:whitespace-pre-wrap
                after:invisible
                after:content-[attr(data-cloned-val)_'_']
                after:border
            "
            id="descriptionWrapper">
            <textarea
              className="w-full text-md border border-transparent appearance-none rounded py-2.5 outline-none focus:outline-none"
              id="description"
              rows={2}
              onInput={onDescriptionChangeHandler}
              placeholder="Description"
              value={description}
              required
            ></textarea>
          </div>
          {isContentEdited && (
            <div className="flex justify-between mt-4">
              <div></div>
              <button
                className="border rounded-md cursor-pointer bg-black text-white hover:bg-gray-700 pt-1 pb-2 pl-3 pr-4 w-max transition transform"
                type="submit">
                {params.id === "new"
                  ? "Submit"
                  : "Update"}
              </button>
            </div>
          )}
        </form>

        {/* Right */}
        <div className="w-2/12"></div>
      </div>
    )
  }

  return (
    <div className="bg-slate-200 min-h-screen" onClick={() => isModalSelected && setModalSelected(false)}>
      {isLoading && <>
        <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
          <Loading />
          <div className="absolute bg-white opacity-40 w-full h-full z-10"></div>
        </div>
      </>}

      {isInitiated && isNotFound && <>
        <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
          <NoteNotFound />
        </div>
      </>
      }

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
        {wrapper()}
      </main>
    </div>
  );
}
