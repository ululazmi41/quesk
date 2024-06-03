"use client"

import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react';

import "@/app/globals.css"
import { Task } from '@/models/enum/Task';

export default function Home() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isModalSelected, setModalSelected] = useState(false)
  const [id, setId] = useState("")
  const { push } = useRouter()

  const task: Task = {
    id: "-1",
    user_id: "-1",
    title: 'hello',
    description: 'world',
    completed: false,
    created_at: "-1",
    updated_at: "-1",
  }

  useEffect(() => {
    const cookie = document.cookie
    if (cookie === "") {
      redirect("/login")
    } else {
      const userId = cookie.split('=')[1]
      if (userId === "") {
        redirect("/login")
      } else {
        // TODO: check if user id is identical, else, show 404 page
        setId(userId)
      }
    }
  }, [])

  const handleLogout = () => {
    document.cookie = "userId=;SameSite=None; Secure"
    push("/login")
  }

  const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const onDescriptionChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const descriptionWrapperElement: HTMLTextAreaElement = document.querySelector('#descriptionWrapper')!
    descriptionWrapperElement.dataset.clonedVal = e.target.value
    // console.log(JSON.parse(JSON.stringify(e.target.value)))
    setDescription(e.target.value)
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
          <div className="w-2/12"></div>

          {/* Middle */}
          <form className="bg-white h-max w-8/12 pt-2 pb-8 px-4 rounded-sm">
            <input
              id="title"
              type="text"
              name="title"
              value={title}
              className="text-xl font-bold outline-none hover:outline-none w-full text-ellipsis"
              placeholder="Title"
              onChange={onTitleChangeHandler}
              readOnly={task.completed}
              required
            />
            <div className="flex justify-between mt-1">
              <p id="date" className='text-sm text-gray-400'>{showFormattedDate(task.updated_at)}</p>
              <div className="w-max text-xs px-2 py-1 rounded-lg text-white border border-yellow-600 bg-yellow-400">Completed</div>
            </div>
            {/* <textarea
              id="description"
              name="description"
              value={description}
              className="text-xl font-bold outline-none hover:outline-none w-full text-ellipsis"
              placeholder="Desccription"
              onChange={onDescriptionChangeHandler}
              required
            /> */}
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
                required
              ></textarea>
            </div>
            {/* {isContentEdited && (
              state === "new"
                ? <button type="submit">{submitNote}</button>
                : <button type="submit">{updateNoteLocalization}</button>
            )} */}
            <div className="flex justify-between mt-4">
              <div></div>
              <button
                className="border rounded-md cursor-pointer bg-black text-white hover:bg-gray-700 pt-1 pb-2 pl-3 pr-4 w-max transition transform"
                type="submit">
                Save
              </button>
            </div>

          </form>

          {/* Right */}
          <div className="w-2/12"></div>
        </div>
      </main>
    </div>
  );
}
