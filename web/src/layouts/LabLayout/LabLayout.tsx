import { useState, useEffect } from 'react'

import { MoonSat, SunLight } from 'iconoir-react'

import { SkipNavLink, SkipNavContent, Link, routes } from '@redwoodjs/router'
import '@reach/skip-nav/styles.css'

type LabLayoutProps = {
  children?: React.ReactNode
}

const LabLayout = ({ children }: LabLayoutProps) => {
  const [openNav, setOpenNav] = useState(false)
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    )
  }, [])

  const toggleTheme = () => {
    const isDark = localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkMode(!isDark)
    localStorage.theme = isDark ? 'light' : 'dark'
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  const navList = (
    <ul className="mb-2 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-10">
      <li className="flex items-center">One Link</li>
      <li className="flex items-center">Another</li>
    </ul>
  )

  return (
    <div className="h-screen bg-white text-black dark:bg-gray-dark dark:text-white">
      <SkipNavLink />
      <nav className="sticky max-w-full border-b border-gray-dark bg-white px-4 py-2 text-lg backdrop-blur-sm dark:border-purple dark:bg-gray-dark lg:px-8 lg:py-3">
        <Link className="inline-block" to={routes.home()}>
          <span className="mr-4 cursor-pointer py-1.5 font-normal">
            TonalityLab
          </span>
        </Link>
        <div className="hidden lg:ml-16 lg:inline-block">{navList}</div>
        <button
          className="float-right hidden cursor-pointer lg:inline-block"
          onClick={toggleTheme}
        >
          {darkMode ? (
            <MoonSat className="h-6 w-6" />
          ) : (
            <SunLight className="h-6 w-6" />
          )}
        </button>
      </nav>
      <SkipNavContent />
      <main className="px-4 py-6 lg:px-6 lg:py-8">{children}</main>
    </div>
  )
}

export default LabLayout
