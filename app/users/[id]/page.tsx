"use client"

import "@/app/globals.css"
import Image from 'next/image';
import { User } from '@/models/enum/User';
import { Loading } from "../../components/loading";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { getToken } from "@/app/utils/lib";

enum ErrorMessage {
  Empty = "",
  UserNotFound = "User not found",
  Unauthorized = "Unauthorized"
}

const ErrorComponent = ({ errorMessage }: { errorMessage: ErrorMessage }) => {
  return (
    <div className="bg-white h-max w-max pt-2 pb-8 px-16 rounded-lg m-auto">
      <Image
        className="m-auto my-4"
        src="/warning.png"
        width={100}
        height={100}
        alt="note not found icon"
      />
      <p className="text-center font-bold text-lg">{errorMessage}</p>
    </div>
  )
}

const ModalComponent = ({ username, email, setModalOpened }: { username: string, email: string, setModalOpened: Dispatch<SetStateAction<boolean>> }) => {
  const [isLoading, setLoading] = useState(false)
  const [isEmailInvalid, setEmailInvalid] = useState(false)
  const [isUsernameInvalid, setUsernameInvalid] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()

    const { username, email } = e.currentTarget
    console.log(username.value, email.value)
    setTimeout(() => {
      setLoading(false)
      setEmailInvalid(prev => !prev)
      setUsernameInvalid(prev => !prev)
    }, 2000)
  }

  const handleEmailChange = () => {
    if (isEmailInvalid) {
      setEmailInvalid(false)
    }
  }

  const handleUsernameChange = () => {
    if (isUsernameInvalid) {
      setUsernameInvalid(false)
    }
  }

  return (
    <div className="absolute grid w-screen h-screen z-10">
      <form onSubmit={handleSubmit} className="z-20 m-auto relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="mx-auto max-w-md">
          <div className="text-center font-semibold text-xl">Edit Detail</div>
          <div className="divide-y divide-gray-300/50">
            <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="username">
                    Username
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input onChange={handleUsernameChange} className={(isUsernameInvalid ? "border-red-400 text-red-400" : "border-gray-300") + " appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"} id="username" type="text" defaultValue={username} />
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="email">
                    Email
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input onChange={handleEmailChange} className={(isEmailInvalid ? "border-red-400 text-red-400" : "border-gray-300") + " appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"} id="email" type="text" defaultValue={email} />
                </div>
              </div>
              <div className="flex justify-between">
                <div></div>
                <div className="flex gap-2">
                  <button disabled={isLoading} onClick={() => setModalOpened(false)} className={(isLoading ? "" : "hover:bg-gray-600/60") + " bg-gray-600 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"} type="button">
                    Cancel
                  </button>
                  <button disabled={isLoading} className={(isLoading ? "bg-black/40" : "bg-black hover:bg-black/60") + " shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"} type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="absolute bg-white w-screen h-screen opacity-80 transition transform"></div>
    </div>
  )
}

export default function Page({ params }: { params: { id: string } }) {
  // const [user, setUser] = useState<User>()
  const { push } = useRouter()
  const [user, setUser] = useState<User>(User.empty())
  const [error, setError] = useState<ErrorMessage>()
  const [isLoading, setLoading] = useState(false)
  const [isInitiated, setInitiated] = useState(false)
  const [isModalOpened, setModalOpened] = useState(false)
  const [isModalSelected, setModalSelected] = useState(false)

  const handleLogout = () => {
    document.cookie = "userId=;SameSite=None; Secure"
    push("/login")
  }

  useEffect(() => {
    if (isInitiated) {
      return
    }

    const asyncFunc = async () => {
      const { token } = getToken(document.cookie)
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      if (!response.ok) {
        if (response.status === 403) {
          setError(ErrorMessage.Unauthorized)
        } else if (response.status === 404) {
          setError(ErrorMessage.UserNotFound)
        }
        setLoading(false)
        setInitiated(true)
        return
      }
      const { data } = await response.json()
      const user: User = data

      setUser(user)
      setError(ErrorMessage.Empty)
      setLoading(false)
      setInitiated(true)
    }
    asyncFunc()
  }, [isInitiated, params.id])

  const renderBody = () => {
    if (!isInitiated || error !== ErrorMessage.Empty) {
      return <></>
    }

    return (<>
      <div className="bg-white h-max w-6/12 pt-2 pb-8 px-4 rounded-sm">
        <Image
          className="m-auto mt-8"
          onClick={() => setModalSelected(true)}
          src="/user.png"
          width={58}
          height={58}
          alt="user icon"
        />
        <div className="flex gap-4 mt-8 m-auto w-max">
          <div>
            <p className="font-sans font-md">Username</p>
            <p className="font-sans font-md">Email Address</p>
            <p className="font-sans font-md">Password</p>
          </div>
          <div>
            <p className="font-semibold font-md">{user.username}</p>
            <p className="font-semibold font-md">{user.email}</p>
            <p className="font-semibold font-md">********</p>
          </div>
        </div>
        <div className="flex justify-between w-5/6 m-auto">
          <div></div>
          <button onClick={() => setModalOpened(true)} className="mt-4 bg-black hover:bg-black/40 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">edit</button>
        </div>
      </div>
    </>)
  }

  return (
    <div className="bg-slate-200 min-h-screen" onClick={() => isModalSelected && setModalSelected(false)}>
      {!isInitiated && <>
        <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
          <Loading />
          <div className="absolute bg-white opacity-40 w-full h-full z-10"></div>
        </div>
      </>}
      {isModalOpened && <>
        <ModalComponent username={user.username ?? ""} email={user.email} setModalOpened={setModalOpened} />
      </>}
      <main className="w-2/3 m-auto">
        <nav className="flex justify-between pt-4 pb-2 px-4 z-20">
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
              <button className="pl-2 w-36 h-8 hover:bg-black text-left text-white transition transform">Profile</button>
              <button onClick={handleLogout} className="pl-2 pb-1 w-36 h-8 hover:bg-black text-left text-white transition transform">Logout</button>
            </div>
          </div>
        </nav>
        <div className="relative flex mt-8">
          {/* Left */}
          <div className="w-3/12"></div>

          {/* Middle */}
          {renderBody()}
          {isInitiated && error !== ErrorMessage.Empty && <>
            <div className="grid w-full justify-items-center items-center z-10 mt-24 md:mt-28 lg:mt-36">
              <ErrorComponent errorMessage={error ?? ErrorMessage.Empty} />
            </div>
          </>
          }

          {/* Right */}
          <div className="w-3/12"></div>
        </div>
      </main>
    </div>
  )
}