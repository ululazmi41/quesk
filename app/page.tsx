"use client"

import { redirect, useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function Home() {
  const { push } = useRouter()
  
  useEffect(() => {
    const cookie = document.cookie
    if (cookie === "") {
      redirect("/login")
    } else {
      const userId = cookie.split('=')[1]
      if (userId === "") {
        redirect("/login")
      } else {
        console.log(userId)
      }
    }
  })

  const handleLogout = () => {
    document.cookie = "userId=;SameSite=None; Secure"
    console.log("logging out...")
    push("/login")
  }

  return (
    <main>
      hello
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
