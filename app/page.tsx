"use client"

// Next.js and React
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react'

// Third Party / External library
import JWT from 'jsonwebtoken'

// Stylesheet
import "@/app/globals.css"

// Utils
import { intl } from '@/i18n/intl'
import { getToken } from './utils/lib'

// Data
import { appLocalStorage } from '@/data/locaStorage'

// Enums
import { Task } from '@/models/enum/Task'

// Components
import TaskComponent from './components/TaskComponent'
import DarkThemeToggler from './components/DarkModeTogglerComponent'
import { LoadingComponent } from './components/LoadingComponent'
import LocaleTogglerComponent from './components/LanguageTogglerComponent'

function EmptyTask({ message }: { message: string }) {
  return (
    <>
      <Image
        className="m-auto"
        src="/empty.png"
        width={84}
        height={84}
        alt="no task created icon"
      />
      <p className="font-lg text-center mt-2 text-gray-800">{message}</p>
    </>
  )
}

export default function Home() {
  const [token, setToken] = useState<string>()
  const [id, setId] = useState<string>()
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksFiltered, setTasksFiltered] = useState<Task[]>([])
  
  const [isLoading, setLoading] = useState(true)
  const [isInitiated, setInitiated] = useState(false)
  const [isModalSelected, setModalSelected] = useState(false)

  // theme
  const [isDarkmode, setDarkmode] = useState(false)

  // nav
  const { push } = useRouter()

  // locale
  const [locale, setLocale] = useState("en")

  useLayoutEffect(() => {
    const localLocale = appLocalStorage.getLocale()
    setLocale(localLocale)
    intl.changeLocale(localLocale)
    refreshTheme()
  }, [])

  const toggleLocale = () => {
    const toggled = locale === "en" ? "id" : "en"
    intl.changeLocale(toggled)
    appLocalStorage.changeLocale(toggled)
    setLocale(toggled)
  }

  useEffect(() => {
    if (!isInitiated) {
      const { token, success } = getToken(document.cookie)
      if (!success) {
        redirect("/login")
      }

      const payload = JWT.decode(token) as JWT.JwtPayload
      
      setId(payload.id)
      setToken(token)

      // get tasks
      const asyncFunc = async () => {
        const response = await fetch(`/api/tasks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            redirect('/login')
          } else {
            console.error(`Unhandled response status code: ` + response.status)
          }
        }

        const { data } = await response.json()
        
        setTasks(data)
        setTasksFiltered(data)
        
        setLoading(false)
        setInitiated(true)
      }
      asyncFunc()
    }
  }, [isInitiated, isDarkmode])

  const refreshTheme = () => {
    const isDarkmode = appLocalStorage.getDarkmode()
    if (isDarkmode && !document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark')
    } else if (!isDarkmode && document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleDarkmode = () => {
    appLocalStorage.toggleDarkmode()
    const modifiedDarkmode = appLocalStorage.getDarkmode()
    setDarkmode(modifiedDarkmode)
    refreshTheme()
  }

  const handleLogout = () => {
    document.cookie = "token=;SameSite=None; Secure"
    push("/login")
  }

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchElement: HTMLInputElement = document.querySelector('#search')!
    const search = searchElement.value

    if (!isInitiated) {
      return
    }

    if (search === "") {
      setTasksFiltered(tasks)
    } else {
      const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
      setTasksFiltered(filtered)
    }
  }

  const refreshTasks = async () => {
    setLoading(true)

    const response = await fetch(`/api/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    })
    const { data } = await response.json()
    
    setTasks(data)
    setTasksFiltered(data)

    setLoading(false)
  }

  const renderActiveTasks = () => {
    if (isLoading) {
      return <>
        <div className="m-auto grid justify-items-center items-center z-20 opacity-40">
          <LoadingComponent />
        </div>
      </>
    } else {
      const activeTasks = tasksFiltered.filter(t => !t.completed).sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
      if (activeTasks.length > 0) {
        return (
          <div className="grid gap-2">
            {activeTasks.map((el, i) => (
              <TaskComponent key={el.id} task={el} refreshTasks={refreshTasks} setLoading={setLoading} locale={locale} />
            ))}
          </div>
        )
      } else {
        return <EmptyTask message="Task is empty." />
      }
    }
  }

  const renderCompletedTasks = () => {
    if (isLoading) {
      return <>
        <div className="m-auto grid justify-items-center items-center z-20 opacity-40">
          <LoadingComponent />
        </div>
      </>
    } else {
      const completedTasks = tasksFiltered.filter(t => t.completed).sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
      if (completedTasks.length > 0) {
        return (
          <div className="grid gap-2">
            {completedTasks.map((el, i) => (
              <TaskComponent key={el.id} task={el} refreshTasks={refreshTasks} setLoading={setLoading} locale={locale} />
            ))}
          </div>
        )
      } else {
        return <EmptyTask message="No task completed yet." />
      }
    }
  }

  return (
    <div className="bg-slate-200 dark:bg-gray-700 min-h-screen transition transform duration-300" onClick={() => isModalSelected && setModalSelected(false)}>
      {!isInitiated && <div className="absolute grid w-screen h-full justify-items-center items-center z-20">
        <div className="absolute bg-white w-full h-full"></div>
        <LoadingComponent />
        <div className="absolute bg-white/40 dark:bg-black/50 w-full h-full"></div>
      </div>}
      <main className="w-2/3 m-auto">
        <nav className="flex justify-between pt-4 pb-2 px-4">
          {/* Left */}
          <div className="flex items-center cursor-pointer" onClick={() => push('/')}>
            <Image
              className="m-auto"
              onClick={() => push("/")}
              src="/notes.png"
              width={24}
              height={24}
              alt="brand icon"
            />
            <h1 className="text-lg font-semibold text-black dark:text-white/70 ml-4">Quesk</h1>
          </div>

          {/* Right */}
          <div className="flex gap-3">
            <LocaleTogglerComponent locale={locale} onClick={toggleLocale} />
            <div className="ml-1">
              <DarkThemeToggler isDarkmode={isDarkmode} toggleDarkmode={toggleDarkmode} />
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
                <button onClick={() => push(`/users/${id}`)} className="pl-2 w-36 h-8 hover:bg-black text-left text-white dark:text-white/70 transition transform">{intl.lib.nav.profile}</button>
                <button onClick={handleLogout} className="pl-2 pb-1 w-36 h-8 hover:bg-black text-left text-white dark:text-white/70 transition transform">{intl.lib.nav.logout}</button>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex mt-8">
          {/* Left */}
          <div className="w-3/12 px-4 space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Image
                  className=""
                  src="/search.png"
                  width={14}
                  height={14}
                  alt="search icon"
                />
              </div>
              <input className="border dark:border-none rounded-md cursor-pointer dark:bg-black/50 dark:hover:bg-black/70 dark:text-white/70 pt-1 pb-2 pl-3 pr-4 w-max transition transform" id="search" type="text" placeholder={intl.lib.home.search} onChange={onSearch} />
            </div>
            <button
              className="border border-black/50 dark:hover:border-white/70 rounded-md cursor-pointer bg-black dark:bg-black/50 hover:bg-gray-700 dark:hover:bg-dark/70 text-white dark:text-white/70 pt-1 pb-2 pl-3 pr-4 w-max transition transform"
              onClick={() => push(`/tasks/new`)}>
              + {intl.lib.home.create}
            </button>
          </div>

          {/* Middle */}
          <div className="bg-white dark:bg-gray-800 h-max w-6/12 pt-2 pb-8 px-4 rounded-md mb-4">
            <h2 className="font-bold dark:text-white/70">{intl.lib.home.myTask}</h2>
            <div className="flex gap-2 w-max pr-2 text-blue-600 hover:text-blue-900 dark:text-white/50 dark:hover:text-white/90 mt-2 cursor-pointer transition transform" onClick={() => push(`/tasks/new`)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {intl.lib.home.addATask}
            </div>
            <div className="mt-2"></div>
            {renderActiveTasks()}
            <h2 className="font-bold dark:text-white/70 mt-2">{intl.lib.home.completed}</h2>
            <div className="mt-2"></div>
            {renderCompletedTasks()}
          </div>
        </div>

        {/* Right */}
        <div className="w-3/12"></div>
      </main>
    </div>
  );
}
