"use client"

import Image from 'next/image'

import "@/app/globals.css"

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loading } from '../components/loading'
import Link from 'next/link'

export default function Login() {
  const [isLoading, setLoading] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [passwordInvalid, setPasswordInvalid] = useState(false)

  const { push } = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setLoading(true)
    e.preventDefault()
    
    const emailElement: HTMLInputElement = document.querySelector('#email')!
    const passwordElement: HTMLInputElement = document.querySelector('#password')!

    const email = emailElement.value
    const password = passwordElement.value

    if (email === "" || password === "") {
      if (email === "") {
        setEmailInvalid(true)
      }

      if (password === "") {
        setPasswordInvalid(true)
      }

      setLoading(false)
      return
    }
    
    const response = await fetch("/api/auth", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })

    const { success, emailInvalid, passwordInvalid, userId } = await response.json()
    if (success) {
      document.cookie = `userId=${userId};SameSite=None; Secure`
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
    <main className="grid bg-slate-200 min-h-screen">
      {isLoading && <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
        <Loading />
        <div className="absolute bg-white opacity-40 w-full h-full z-10"></div>
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
