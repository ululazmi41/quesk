"use client"

import "@/app/globals.css"
import Image from 'next/image';
import { User } from '@/models/enum/User';
import { Loading } from "../components/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  // const [user, setUser] = useState<User>()
  const { push } = useRouter()
  const [isLoading, setLoading] = useState(false)
  // const [user, setUser] = useState<User>(User.empty())
  const [isModalSelected, setModalSelected] = useState(false)

  const handleLogout = () => {
    document.cookie = "userId=;SameSite=None; Secure"
    push("/login")
  }

  const user: User = {
    username: "pokedex",
    email: "hello@world.com",
    password: "12345678",
  }

  // useEffect(() => {
  //   const asyncFunc = async () => {
  //     const response = await fetch(`/api/users/${params.id}`)
  //     const { data, success } = await response.json()
  //     if (success) {
  //       setUser(data)
  //     } else {
  //       // TODO: 404
  //     }
  //     setLoading(false)
  //   }
  //   asyncFunc()
  // }, [params.id])

  return (
    <div className="bg-slate-200 min-h-screen" onClick={() => isModalSelected && setModalSelected(false)}>
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
              <button onClick={() => { }} className="pl-2 w-36 h-8 hover:bg-black text-left text-white transition transform">Profile</button>
              <button onClick={handleLogout} className="pl-2 pb-1 w-36 h-8 hover:bg-black text-left text-white transition transform">Logout</button>
            </div>
          </div>
        </nav>
        {isLoading && <>
          <div className="absolute grid w-screen h-screen justify-items-center items-center z-20">
            <Loading />
            <div className="absolute bg-white opacity-40 w-full h-full z-10"></div>
          </div>
        </>}
        <div className="flex mt-8">
          {/* Left */}
          <div className="w-3/12"></div>
          
          {/* Middle */}
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
                <p className="font-semibold font-md">{user.password}</p>
              </div>
            </div>
          </div>
          
          {/* Right */}
          <div className="w-3/12"></div>
        </div>
      </main>
    </div>
  )
}