"use client"

import JWT from 'jsonwebtoken';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import "@/app/globals.css"
import { Task } from '@/models/enum/Task';
import { Loading } from '@/app/components/loading';
import { getToken, showFormattedDate } from '@/app/utils/lib';

enum ErrorMessage {
  empty = "",
  NoteNotFound = "Note not found",
  Unauthorized = "Unauthorized",
}

const NoteNotFound = ({ errorMessage }: { errorMessage: ErrorMessage }) => {
  return (
    <div className="bg-white h-max w-max pt-2 pb-8 px-16 rounded-lg m-auto">
      <Image
        className="m-auto my-4"
        src="/warning.png"
        width={100}
        height={100}
        alt="note not found icon"
      />
      <p className="text-center font-bold text-lg">{ errorMessage }</p>
    </div>
  )
}

export default function Home({ params }: { params: { id: string } }) {
  // Task
  const [id, setId] = useState(-1)
  const [userId, setUserId] = useState(-1)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [completed, setCompleted] = useState(false)
  const [updatedAt, setUpdatedAt] = useState((new Date()).toISOString())

  // error
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(ErrorMessage.empty)

  const [isOk, setOk] = useState<boolean>()
  const [isLoading, setLoading] = useState(true)
  const [isInitiated, setInitiated] = useState(false)
  const [isContentEdited, setContentEdited] = useState(false)
  const [isModalSelected, setModalSelected] = useState(false)
  const { push } = useRouter()

  useEffect(() => {
    if (isInitiated && isOk) {
      const descriptionWrapperElement: HTMLTextAreaElement = document.querySelector('#descriptionWrapper')!
      descriptionWrapperElement.dataset.clonedVal = description
    }

    const { token, success } = getToken(document.cookie)
    if (!success) {
      redirect("/login")
    }
    
    const payload = JWT.decode(token) as JWT.JwtPayload
    
    setUserId(parseInt(payload.id))

    if (!isInitiated) {
      if (params.id === "new") {
        setOk(true)
        setLoading(false)
        setInitiated(true)
      } else {
        const asyncFunc = async () => {
          const response = await fetch(`/api/tasks/${parseInt(params.id)}`, {
            headers: { 'Authorization': 'Bearer ' + token }
          })
          if (!response.ok) {
            if (response.status === 401) {
              redirect('/login')
            } else if (response.status === 403) {
              setErrorMessage(ErrorMessage.Unauthorized)
            } else if (response.status === 404) {
              setErrorMessage(ErrorMessage.NoteNotFound)
            }

            setOk(false)
            setInitiated(true)
            setLoading(false)
            return
          }
          
          const { data } = await response.json()
          setId(data["id"])
          setTitle(data["title"])
          setCompleted(data["completed"])
          setUpdatedAt(data["updated_at"])
          setDescription(data["description"])

          setOk(true)
          setInitiated(true)
          setLoading(false)
        }
        asyncFunc()
      }
    }
  }, [isInitiated, isOk, params.id, id, userId, title, description, completed, updatedAt])

  const handleLogout = () => {
    document.cookie = "token=;SameSite=None; Secure"
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

  const handleSubmit = async () => {
    setLoading(true)
    const task: Task = {
      id,
      user_id: userId,
      title,
      description,
      completed,
    }
    const { token } = getToken(document.cookie)
    const method = params.id === 'new' ? 'POST': 'PUT'
    
    await fetch('/api/tasks', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
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
    if (!isInitiated || !isOk) {
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

      {isInitiated && !isOk && <>
        <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
          <NoteNotFound errorMessage={errorMessage ?? ""} />
        </div>
      </>
      }

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
