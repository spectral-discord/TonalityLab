import { useState, useEffect } from 'react'

import { MoonSat, SunLight } from 'iconoir-react'

import {
  SkipNavLink,
  SkipNavContent,
  Link,
  NavLink,
  routes,
} from '@redwoodjs/router'
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

  const hamburgerLineStyle = 'h-0.5 w-5 my-0.5 rounded-full bg-black dark:bg-white transition ease transform duration-300'
  const navLinkStyle = 'py-[2px] flex hover:text-purple dark:hover:text-pink'
  const activeLinkStyle = 'border-b-2 pb-0 border-gray-dark dark:border-pink hover:text-black hover:dark:text-white'
  const navList = (
    <ul className="mb-2 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:gap-10">
      <li className="flex">
        <NavLink
          to={routes.home({ t: 'b' })}
          className={navLinkStyle}
          activeClassName={activeLinkStyle}
        >
          One Link
        </NavLink>
      </li>
      <li className="flex">
        <NavLink
          to={routes.home({ t: 'a' })}
          activeClassName={activeLinkStyle}
          className={navLinkStyle}
        >
          Another
        </NavLink>
      </li>
    </ul>
  )

  return (
    <div className="h-screen bg-white text-black dark:bg-gray-dark dark:text-white">
      <SkipNavLink />
      <nav className="sticky max-w-full border-b border-gray-dark bg-white px-4 pb-1 pt-2 text-lg backdrop-blur-sm dark:border-purple dark:bg-gray-dark lg:px-8 lg:pb-2 lg:pt-3">
        <Link
          to={routes.home()}
          className="mr-4 inline-block cursor-pointer hover:text-purple hover:dark:text-pink"
        >
          TonalityLab
        </Link>
        <div className="hidden lg:ml-16 lg:inline-block">{navList}</div>
        <button
          className="float-right hidden cursor-pointer hover:text-purple hover:dark:text-pink lg:inline-block lg:pt-0.5"
          onClick={toggleTheme}
        >
          {darkMode ? (
            <MoonSat className="h-6 w-6 stroke-2" />
          ) : (
            <SunLight className="h-6 w-6 stroke-2" />
          )}
        </button>
        <button
          className="float-right flex h-6 w-6 flex-col items-center justify-center lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          <div
            className={`${hamburgerLineStyle}${
              openNav && ' translate-y-1.5 rotate-45'
            }`}
          />
          <div className={`${hamburgerLineStyle}${openNav && ' opacity-0'}`} />
          <div
            className={`${hamburgerLineStyle}${
              openNav && ' -translate-y-1.5 -rotate-45'
            }`}
          />
        </button>
      </nav>
      <SkipNavContent />
      <main className="px-4 py-6 lg:px-6 lg:py-8">{children}</main>
    </div>
  )
}

export default LabLayout
