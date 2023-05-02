import { useState, useEffect } from "react";
import { Link, routes } from '@redwoodjs/router'
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [openNav, setOpenNav] = useState(false);
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
 
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const toggleTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(!isDark);
    localStorage.theme = isDark ? 'light' : 'dark';
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }
 
  const navList = (
    <ul className="mb-2 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-10">
      <span className="flex items-center">
        One Link
      </span>
      <span className="flex items-center">
        Another
      </span>
    </ul>
  );

  return (
  <div className="h-screen bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
    <Navbar className="text-white bg-violet-700 dark:bg-slate-900 max-w-full py-2 px-4 lg:px-8 lg:py-4">
      <Link className="inline-block" to={routes.home()}>
        <Typography className="mr-4 cursor-pointer py-1.5 font-normal">
          <span>TonalityLab</span>
        </Typography>
      </Link>
      <div className="hidden lg:ml-16 lg:inline-block">{navList}</div>
      <div onClick={toggleTheme} className="cursor-pointer hidden py-1.5 lg:inline-block float-right">
        {darkMode ? <SunIcon className="h-6 w-6"/> : <MoonIcon className="h-6 w-6"/>}
      </div>
      <IconButton
        variant="text"
        className="ml-auto float-right  py-2 h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
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
        <div className="container mx-auto">
          {navList}
          <div className="cursor-pointer" onClick={toggleTheme}>
            <span className="inline-block mr-2">{darkMode ? "Light" : "Dark"} Mode</span>
            {darkMode 
              ? <SunIcon className="h-6 w-6 inline-block"/> 
              : <MoonIcon className="h-6 w-6 inline-block"/>}
          </div>
        </div>
      </MobileNav>
    </Navbar>
    <div className="px-6 py-8">
      {children}
    </div>
  </div>
  )
}

export default MainLayout
