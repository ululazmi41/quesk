"use client"

import "@/app/globals.css"
import Image from 'next/image';
import { User } from '@/models/enum/User';
import { Loading } from "../../components/loading";
import { redirect, useRouter } from "next/navigation";
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

const EditDialogComponent = ({ username, email, setModalOpened, refresh }: { username: string, email: string, setModalOpened: Dispatch<SetStateAction<boolean>>, refresh: Function }) => {
  enum EmailError {
    Empty = "",
    Taken = "Email taken",
    Invalid = "Email invalid"
  }

  const [isLoading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<EmailError>(EmailError.Empty)
  const [isEmailInvalid, setEmailInvalid] = useState(false)
  const [isUsernameInvalid, setUsernameInvalid] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()

    const regexEmailValidator = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm // TODO: email validation on register and login
    const { username: usernameElement, email: emailElement } = e.currentTarget

    if (usernameElement.value === username && emailElement.value === email) {
      setLoading(false)
      setModalOpened(false)
      refresh()

      return
    }

    const uernameInvalid = usernameElement.value === ""
    const emailInvalid = emailElement.value === "" || !regexEmailValidator.test(emailElement.value)
    if (uernameInvalid || emailInvalid) {
      if (uernameInvalid) {
        setUsernameInvalid(true)
      }
      if (emailInvalid) {
        setEmailError(EmailError.Invalid)
        setEmailInvalid(true)
      }
      
      setLoading(false)
      return
    }

    const { token, success } = getToken(document.cookie)
    if (!success) {
      redirect("/login")
    }
    
    const response = await fetch(`/api/users`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({
        username: usernameElement.value,
        email: emailElement.value
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        redirect('/login')
      } else if (response.status === 409) {
        const { emailAlreadyExist, usernameAlreadyExist } = await response.json()
        if (emailAlreadyExist) {
          setEmailError(EmailError.Taken)
          setEmailInvalid(true)
        }
        if (usernameAlreadyExist) {
          setUsernameInvalid(true)
        }

        setLoading(false)
        return
      } else {
        console.error(`Unexpected error response status code: ` + response.status)
        
        setLoading(false)
        return
      }
    }

    setLoading(false)
    setModalOpened(false)
    refresh()
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

  const backdropCloseModal = () => {
    if (isLoading) {
      return
    }
    setModalOpened(false)
  }

  return (
    <div className="absolute grid w-screen h-screen z-10">
      <form onSubmit={handleSubmit} className="z-20 m-auto relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="mx-auto max-w-md">
          <div className="text-center font-semibold text-xl">Edit Detail</div>
          <div className="divide-y divide-gray-300/50">
            <div className={"py-8 text-base leading-7 text-gray-600"}>
              <div className={isUsernameInvalid ? "" : "mb-5"}>
                <div className="md:flex md:items-center">
                  <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="username">
                      Username
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input onChange={handleUsernameChange} className={(isUsernameInvalid ? "border-red-400 text-red-400" : "border-gray-300") + " appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"} id="username" type="text" defaultValue={username} />
                  </div>
                </div>
                <div className="md:flex md:items-center mb-2">
                  <div className="md:w-1/3"></div>
                  <div className="md:w-2/3">
                    <p className={(isUsernameInvalid ? "block" : "hidden") + " text-red-400 text-sm font-semibold"}>
                      Username taken
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="email">
                      Email
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input onChange={handleEmailChange} className={(isEmailInvalid ? "border-red-400 text-red-400" : "border-gray-300") + " appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"} id="email" type="text" defaultValue={email} />
                  </div>
                </div>
                <div className="md:flex md:items-center">
                  <div className="md:w-1/3"></div>
                  <div className="md:w-2/3">
                    <p className={(isEmailInvalid ? "block" : "hidden") + " text-red-400 text-sm  font-semibold"}>
                      {emailError}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div></div>
                <div className="flex gap-2">
                  <button disabled={isLoading} onClick={() => setModalOpened(false)} className={(isLoading ? "" : "hover:bg-gray-600/60") + " bg-gray-600 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"} type="button">
                    Cancel
                  </button>
                  <button disabled={isLoading || (isEmailInvalid || isUsernameInvalid)} className={(isLoading ? "bg-black/40" : "bg-black hover:bg-black/60") + " disabled:bg-black/40 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer disabled:cursor-default"} type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div onClick={backdropCloseModal} className="absolute bg-white w-screen h-screen opacity-40 transition transform"></div>
    </div>
  )
}

const PasswordDialogComponent = ({ setModalOpened, refresh }: { setModalOpened: Dispatch<SetStateAction<boolean>>, refresh: Function }) => {
  const [isLoading, setLoading] = useState(false)
  const [isOldPasswordInvalid, setOldPasswordInvalid] = useState(false)
  const [isNewPasswordInvalid, setNewPasswordInvalid] = useState(false)
  const [isConfirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()

    const { oldPassword, newPassword, confirmPassword } = e.currentTarget

    if (oldPassword.value === "") {
      setOldPasswordInvalid(true)

      if (newPassword.value === "") {
        setNewPasswordInvalid(true)
      }

      if (newPassword.value !== confirmPassword.value) {
        setConfirmPasswordInvalid(true)
      }

      setLoading(false)
      return
    }
    
    if (newPassword.value !== "" && newPassword.value === confirmPassword.value) {
      // Update password
      const { token, success } = getToken(document.cookie)
      if (!success) {
        redirect('/login')
      }
      
      const response = await fetch(`/api/users/update-password`, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          oldPassword: Buffer.from(oldPassword.value).toString('base64'),
          newPassword: Buffer.from(newPassword.value).toString('base64')
        })
      })
  
      if (!response.ok) {
        if (response.status === 401) {
          redirect('/login')
        } else if (response.status === 403) {
          setOldPasswordInvalid(true)
          
          setLoading(false)
          return
        } else if (response.status === 401) {
          redirect('/login')
        } else {
          console.error(`Unhandled response status code: ` + response.status)
          
          setLoading(false)
          return
        }
      }

      setLoading(false)
      setModalOpened(false)
      refresh(true)
    } else {
      // Check password
      const { token, success } = getToken(document.cookie)
      if (!success) {
        redirect('/login')
      }
      
      const response = await fetch(`/api/users/check-password`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          password: Buffer.from(oldPassword.value).toString('base64')
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          redirect('/login')
        } else {
          console.error(`Unexpected error response status code: ` + response.status)
          
          setLoading(false)
          return
        }
      }

      const { match } = await response.json()

      if (!match) {
        setOldPasswordInvalid(true)
      }

      if (newPassword.value === "") {
        setNewPasswordInvalid(true)
      }

      if (newPassword.value !== confirmPassword.value) {
        setConfirmPasswordInvalid(true)
      }

      setLoading(false)
    }
  }

  const handleOldPasswordChange = () => {
    if (isOldPasswordInvalid) {
      setOldPasswordInvalid(false)
    }
  }

  const handleNewPasswordChange = () => {
    if (isNewPasswordInvalid) {
      setNewPasswordInvalid(false)
    }
  }

  const handleConfirmPasswordChange = () => {
    if (isConfirmPasswordInvalid) {
      setConfirmPasswordInvalid(false)
    }
  }

  const backdropCloseModal = () => {
    if (isLoading) {
      return
    }
    setModalOpened(false)
  }

  return (
    <div className="absolute grid w-screen h-screen z-10">
      <form onSubmit={handleSubmit} className="z-20 m-auto relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="mx-auto max-w-md">
          <div className="text-center font-semibold text-xl">Edit Detail</div>
          <div className="divide-y divide-gray-300/50">
            <div className={"py-8 text-base leading-7 text-gray-600"}>
              {/* Old Password */}
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="username">
                    Old Password
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input onChange={handleOldPasswordChange} className={(isOldPasswordInvalid ? "border-red-400 text-red-400" : "border-gray-300") + " appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"} id="oldPassword" type="password" />
                </div>
              </div>

              {/* New Password */}
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="username">
                    New Password
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input onChange={handleNewPasswordChange} className={(isNewPasswordInvalid ? "border-red-400 text-red-400" : "border-gray-300") + " appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"} id="newPassword" type="password" />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="username">
                    Confirm New Password
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input onChange={handleConfirmPasswordChange} className={(isConfirmPasswordInvalid ? "border-red-400 text-red-400" : "border-gray-300") + " appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"} id="confirmPassword" type="password" />
                </div>
              </div>

              <div className="flex justify-between">
                <div></div>
                <div className="flex gap-2">
                  <button disabled={isLoading} onClick={() => setModalOpened(false)} className={(isLoading ? "" : "hover:bg-gray-600/60") + " bg-gray-600 shadow focus:shadow-outline focus:outline-none text-white font-bnew py-2 px-4 rounded"} type="button">
                    Cancel
                  </button>
                  <button disabled={isLoading || (isOldPasswordInvalid || isNewPasswordInvalid || isConfirmPasswordInvalid)} className={(isLoading ? "bg-black/40" : "bg-black hover:bg-black/60") + " disabled:bg-black/40 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer disabled:cursor-default"} type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div onClick={backdropCloseModal} className="absolute bg-white w-screen h-screen opacity-40 transition transform"></div>
    </div>
  )
}

export default function Page({ params }: { params: { id: string } }) {
  // const [user, setUser] = useState<User>()
  const { push } = useRouter()
  const [user, setUser] = useState<User>(User.empty())
  const [error, setError] = useState<ErrorMessage>()
  const [isInitiated, setInitiated] = useState(false)
  const [isModalSelected, setModalSelected] = useState(false)

  // Modals or dialogs
  const [isEditOpened, setEditOpened] = useState(false)
  const [isPasswordOpened, setPasswordOpened] = useState(false)

  const handleLogout = () => {
    document.cookie = "token=;SameSite=None; Secure"
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
        if (response.status === 401) {
          redirect('/login')
        } else if (response.status === 403) {
          setError(ErrorMessage.Unauthorized)
        } else if (response.status === 404) {
          setError(ErrorMessage.UserNotFound)
        }
        setInitiated(true)
        return
      }
      const { data } = await response.json()
      const user: User = data

      setUser(user)
      setError(ErrorMessage.Empty)
      setInitiated(true)
    }
    asyncFunc()
  }, [isInitiated, params.id])

  const refresh = () => {
    setInitiated(false)
  }

  const renderBody = () => {
    if (!isInitiated || error !== ErrorMessage.Empty) {
      return <></>
    }

    return (<>
      <div className="my-auto mx-4 sm:m-auto text-sm md:text-base w-full sm:w-8/12 lg:w-6/12 bg-white h-max pt-2 pb-8 px-4 rounded-sm">
        <Image
          className="m-auto mt-8"
          onClick={() => setModalSelected(true)}
          src="/user.png"
          width={58}
          height={58}
          alt="user icon"
        />
        <div className="grid grid-cols-2 gap-4 mt-8 mb-4 m-auto w-max">
          <p className="font-sans font-md mb-2">Username</p>
          <p className="font-semibold text-md mb-2">{user.username}</p>
          
          <p className="font-sans font-md mb-2">Email Address</p>
          <p className="font-semibold text-md mb-2">{user.email}</p>
          
          <p className="font-sans font-md">Password</p>
          <div>
            <p className="font-semibold text-md mb-0">********</p>
            <a onClick={() => setPasswordOpened(true)} className="text-sm text-blue-700 hover:text-blue-600 hover:underline decoration-blue-700 cursor-pointer transition transform">change password</a>
          </div>
        </div>
        <div className="flex justify-between w-5/6 m-auto">
          <div></div>
          <button onClick={() => setEditOpened(true)} className="mt-4 bg-black hover:bg-black/40 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">edit</button>
        </div>
      </div>
    </>)
  }

  return (
    <div className="bg-slate-200 min-h-screen" onClick={() => isModalSelected && setModalSelected(false)}>
      {/* Loading */}
      {!isInitiated && <>
        <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
          <Loading />
          <div className="absolute bg-white opacity-40 w-full h-full z-10"></div>
        </div>
      </>}
      
      {/* Modals / dIalogs */}
      {isEditOpened && <>
        <EditDialogComponent username={user.username ?? ""} email={user.email} setModalOpened={setEditOpened} refresh={refresh} />
      </>}
      {isPasswordOpened && <>
        <PasswordDialogComponent setModalOpened={setPasswordOpened} refresh={refresh} />
      </>}

      <main className="sm:w-2/3 m-auto">
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
            <div className={(isModalSelected ? "block" : "hidden") + " absolute bg-[#666666] w-36 mt-2 z-20"}>
              <button className="pl-2 w-36 h-8 hover:bg-black text-left text-white transition transform">Profile</button>
              <button onClick={handleLogout} className="pl-2 pb-1 w-36 h-8 hover:bg-black text-left text-white transition transform">Logout</button>
            </div>
          </div>
        </nav>
        <div className="relative flex mt-8">
          {renderBody()}
          {isInitiated && error !== ErrorMessage.Empty && <>
            <div className="grid w-full justify-items-center items-center z-10 mt-24 md:mt-28 lg:mt-36">
              <ErrorComponent errorMessage={error ?? ErrorMessage.Empty} />
            </div>
          </>}
        </div>
      </main>
    </div>
  )
}