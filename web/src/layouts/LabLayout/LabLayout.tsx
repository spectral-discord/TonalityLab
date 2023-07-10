import { useState, useEffect } from 'react'

import { MoonSat, SunLight } from 'iconoir-react'

import { SkipNavLink, SkipNavContent, Link, NavLink, routes } from '@redwoodjs/router'
import '@reach/skip-nav/styles.css'

type LabLayoutProps = {
  children?: React.ReactNode
}

const LabLayout = ({ children }: LabLayoutProps) => {
  const [openNav, setOpenNav] = useState(false)
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  const navLinks = [
    { title: 'Tunings', destination: routes.tunings() },
    { title: 'Another', destination: routes.home({ t: 'b' }) }
  ]

  useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 960 && setOpenNav(false))
  }, [])

  const toggleTheme = () => {
    const isDark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkMode(!isDark)
    localStorage.theme = isDark ? 'light' : 'dark'
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-gray-dark dark:text-white">
      <SkipNavLink />
      <nav className={`flex-none sticky top-0 max-w-full border-b border-gray-dark bg-white px-4 pb-1 pt-2 text-lg backdrop-blur-sm dark:border-purple dark:bg-gray-dark lg:px-8 lg:pb-2 lg:pt-3 ${openNav && 'h-screen sm:h-fit'}`}>
        <Link to={routes.home()} className="mr-4 inline-block cursor-pointer hover:text-purple hover:dark:text-pink">
          TonalityLab
        </Link>
        <button
          className="icon-button float-right hidden lg:inline-block lg:pt-0.5"
          onClick={toggleTheme}
          aria-label={`${darkMode ? 'light' : 'dark'} mode toggle`}
        >
          {darkMode ? <MoonSat className="icon" /> : <SunLight className="icon" />}
        </button>
        <button
          className="float-right flex h-6 w-6 flex-col items-center justify-center lg:hidden"
          onClick={() => setOpenNav(!openNav)}
          aria-label={`${openNav ? 'close' : 'open'} navigation menu`}
        >
          <div className={`hamburger-line ${openNav && 'translate-y-1.5 rotate-45'}`} />
          <div className={`hamburger-line ${openNav && 'opacity-0'}`} />
          <div className={`hamburger-line ${openNav && '-translate-y-1.5 -rotate-45'}`} />
        </button>
        <div className={`lg:ml-16 lg:inline-block ${!openNav && 'hidden'}`}>
          <ul className="mb-2 mt-2 flex flex-col gap-2 px-1 lg:mb-0 lg:mt-0 lg:flex-row lg:gap-10">
            {navLinks.map(navLink => (
              <li className="flex px-3" key={`Link to ${navLink.title}`}>
                <NavLink
                  to={navLink.destination}
                  className="flex py-[2px] hover:text-purple dark:hover:text-pink"
                  activeClassName="border-b-2 pb-0 border-gray-dark dark:border-pink hover:text-black hover:dark:text-white"
                >
                  {navLink.title}
                </NavLink>
              </li>
            ))}
            <li className="flex border-t border-gray-dark px-3 dark:border-purple dark:bg-gray-dark lg:px-0">
              <button
                className="icon-button pt-3.5 lg:hidden"
                onClick={toggleTheme}
                aria-label={`${darkMode ? 'light' : 'dark'} mode toggle`}
              >
                {darkMode ? (
                  <span>
                    Dark Mode <MoonSat className="icon -mt-0.5 inline-block" />
                  </span>
                ) : (
                  <span>
                    Light Mode <SunLight className="icon -mt-0.5 inline-block" />
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <SkipNavContent />
      <main className={`flex grow px-4 py-6 lg:px-6 lg:py-8 ${openNav && 'hidden sm:block'}`}>{children}</main>
    </div>
  )
}

export default LabLayout
