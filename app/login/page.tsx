"use client"

import Image from 'next/image'

import "@/app/globals.css"

import { FormEvent, useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { LoadingComponent } from '../components/LoadingComponent'
import Link from 'next/link'

export default function Login() {
  const [isLoading, setLoading] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  
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

  const { push } = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setLoading(true)
    e.preventDefault()
    
    const { email, password } = e.currentTarget

    if (email.value === "" || password.value === "") {
      if (email === "") {
        setEmailInvalid(true)
      }

      if (password.value === "") {
        setPasswordInvalid(true)
      }

      setLoading(false)
      return
    }
    
    const inJson = JSON.stringify({
      email: email.value,
      password: password.value
    })
    const encoded = Buffer.from(inJson).toString('base64')
    const response = await fetch("/api/auth", {
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

    const { token } = await response.json()
    if (token) {
      document.cookie = `token=${token};SameSite=None; Secure`
      setLoading(false)
      push("/")
    } else {
      if (emailInvalid) {
        setEmailInvalid(true)
      }

      if (passwordInvalid) {
        setPasswordInvalid(true)
      }
      setLoading(false)
    }
  }

  const emailOnChange = () => {
    if (emailInvalid) {
      setEmailInvalid(false)
    }
  }

  const passwordOnChange = () => {
    if (passwordInvalid) {
      setPasswordInvalid(false)
    }
  }

  return (
    <main className="grid bg-slate-200 dark:bg-gray-700 min-h-screen">
      {isLoading && <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
        <LoadingComponent />
        <div className="absolute bg-white dark:bg-gray-400 opacity-40 w-full h-full z-10"></div>
      </div>}
      <div className="m-auto sm:w-96">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <Image
            className="m-auto my-8"
            src="/login.png"
            width={100}
            height={100}
            alt="login icon"
          />
          <p className="text-center text-gray-700 text-lg font-bold mb-2">Login</p>
          <div className="mb-4">
            <label className={"block text-sm font-bold mb-2"} htmlFor="email">
              Email
            </label>
            <input className={(emailInvalid ? "border border-red-500 text-red-500 placeholder-red-500" : "text-gray-700") + " shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"} id="email" type="text" placeholder="Email" onChange={emailOnChange} />
          </div>
          <div className="mb-6">
            <label className={"block text-sm text-gray-700 font-bold mb-2"} htmlFor="password">
              Password
            </label>
            <input className={(passwordInvalid ? "border border-red-500 text-red-500 placeholder-red-500" : "text-gray-700") + " shadow appearance-none rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"} id="password" type="password" placeholder="********" onChange={passwordOnChange} />
            <p>Don&apos;t have an account? <Link href="/register" className="cursor-pointer text-blue-600 hover:underline hover:decoration-blue-400 hover:text-blue-400 transition transform">register</Link></p>
          </div>
          <button className="w-full bg-black hover:opacity-70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition duration-150" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
