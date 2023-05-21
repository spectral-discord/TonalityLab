import { useState, useEffect } from 'react'

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
} from '@material-tailwind/react'

import { Link, routes } from '@redwoodjs/router'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
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
      <span className="flex items-center">One Link</span>
      <span className="flex items-center">Another</span>
    </ul>
  )

  return (
    <div className="h-screen bg-white text-black dark:bg-gray-dark dark:text-white">
      <Navbar className="max-w-full bg-purple px-4 py-2 text-lg text-white lg:px-8 lg:py-4">
        <Link className="inline-block" to={routes.home()}>
          <Typography className="mr-4 cursor-pointer py-1.5 font-normal">
            <span>TonalityLab</span>
          </Typography>
        </Link>
        <div className="hidden lg:ml-16 lg:inline-block">{navList}</div>
        <IconButton
          variant="text"
          className="float-right hidden cursor-pointer py-1.5 lg:inline-block"
          ripple={false}
          onClick={toggleTheme}
        >
          {darkMode ? (
            <MoonIcon className="h-6 w-6" />
          ) : (
            <SunIcon className="h-6 w-6" />
          )}
        </IconButton>
        <IconButton
          variant="text"
          className="text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent float-right ml-auto h-6 w-6 py-2 lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
        <MobileNav open={openNav}>
          <div className="container mx-auto lg:hidden">
            {navList}
            <button
              className="cursor-pointer"
              onClick={toggleTheme}
              onKeyDown={toggleTheme}
            >
              <span className="mr-2 inline-block">
                {darkMode ? 'Dark' : 'Light'} Mode
              </span>
              {darkMode ? (
                <MoonIcon className="inline-block h-6 w-6" />
              ) : (
                <SunIcon className="inline-block h-6 w-6" />
              )}
            </button>
          </div>
        </MobileNav>
      </Navbar>
      <div className="px-6 py-8">{children}</div>
    </div>
  )
}

export default MainLayout
