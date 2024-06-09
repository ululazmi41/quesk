"use client"

import Image from 'next/image'

import "@/app/globals.css"
import "@/app/style/loading.css"

import { FormEvent, useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { Loading } from '../components/loading'

export default function Login() {
  const [isLoading, setLoading] = useState(false)
  const [emailExist, setEmailExist] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false)

  const { push } = useRouter()
  
  // Darkmode
  const [isDarkmodeInitiated, seDarkmodeInitiated] = useState(false)
  useEffect(() => {
    if (isDarkmodeInitiated) {
      return
    }
    
    const isDarkmode = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDarkmode) {
      document.documentElement.classList.add('dark')
    }
    seDarkmodeInitiated(true)
  }, [isDarkmodeInitiated])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setLoading(true)
    e.preventDefault()
    
    const { email, password, confirmPassword } = e.currentTarget
    if (email.value === "" || password.value === "" || confirmPassword.value === "") {
      if (email.value === "") {
        setEmailInvalid(true)
      }

      if (password.value === "") {
        setPasswordInvalid(true)
      }

      if (confirmPassword.value === "" || password.value !== confirmPassword.value) {
        setConfirmPasswordInvalid(true)
      }

      setLoading(false)
      return
    }
    
    const inJson = JSON.stringify({
      email: email.value,
      password: password.value
    })
    const encoded = Buffer.from(inJson).toString('base64')
    const response = await fetch("/api/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + encoded
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        redirect('/login')
      } else {
        console.error('Unhandler response status code: ' + response.status)
      }
    }

    const { success, emailExist } = await response.json()
    if (success) {
      setLoading(false)
      push("/login")
    } else {
      if (emailExist) {
        setEmailInvalid(true)
        setEmailExist(true)
      }

      setLoading(false)
    }
  }

  const emailOnChange = () => {
    if (emailInvalid) {
      setEmailInvalid(false)
      if (emailExist) {
        setEmailExist(false)
      }
    }
  }

  const passwordOnChange = () => {
    if (passwordInvalid) {
      setPasswordInvalid(false)
    }
  }

  const confirmPasswordOnChange = () => {
    if (confirmPasswordInvalid) {
      setConfirmPasswordInvalid(false)
    }
  }

  return (
    <main className="grid bg-slate-200 dark:bg-gray-700 min-h-screen">
      {isLoading && <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
        <Loading />
        <div className="absolute bg-white dark:bg-gray-400 opacity-40 w-full h-full z-10"></div>
      </div>}
      <div className="m-auto sm:w-96">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <Image
            className="m-auto my-8"
            src="/register.png"
            width={100}
            height={100}
            alt="register icon"
          />
          <p className="text-center text-gray-700 text-lg font-bold mb-2">Register</p>
          <div className="mb-4">
            <label className={"block text-sm font-bold mb-2"} htmlFor="email">
              Email
            </label>
            <input className={(emailInvalid ? "border border-red-500 text-red-500 placeholder-red-500" : "text-gray-700") + " shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"} id="email" type="text" placeholder="Email" onChange={emailOnChange} />
            <p className={(emailInvalid && emailExist ? "block" : "hidden") + " text-red-500 text-xs italic"}>email already exist.</p>
          </div>
          <div className="mb-4">
            <label className={"block text-sm text-gray-700 font-bold mb-2"} htmlFor="password">
              Password
            </label>
            <input className={(passwordInvalid ? "border border-red-500 text-red-500 placeholder-red-500" : "text-gray-700") + " shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"} id="password" type="password" placeholder="********" onChange={passwordOnChange} />
          </div>
          <div className="mb-6">
            <label className={"block text-sm text-gray-700 font-bold mb-2"} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input className={(confirmPasswordInvalid ? "border border-red-500 text-red-500 placeholder-red-500" : "text-gray-700") + " shadow appearance-none rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"} id="confirmPassword" type="password" placeholder="********" onChange={confirmPasswordOnChange} />
            <p>Already have an account? <span onClick={() => push("/login")} className="cursor-pointer text-blue-600 hover:underline hover:decoration-blue-400 hover:text-blue-400 transition transform">login</span></p>
          </div>
          <button className="w-full bg-black hover:opacity-70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition duration-150" type="submit">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
