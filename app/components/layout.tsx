'use client'

import Link from 'next/link'
import { useAuth } from '../context/auth-context'
import { Button } from './ui/button'
import { useState } from 'react'
import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/theme-context'

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  const { user, signInWithGoogle, signOut } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-white'
    }`}>
      <header className={`fixed top-0 left-0 right-0 ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'
      } shadow-sm z-50`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>YT Analyzer</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/about" 
                className={`${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-2 text-sm ${
                      isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <span className="max-w-[150px] truncate">{user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          signOut()
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full justify-start px-4 py-2 text-sm ${
                          isDarkMode 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={() => signInWithGoogle()}
                  className={isDarkMode 
                    ? 'bg-white hover:bg-gray-100 text-gray-900' 
                    : 'bg-black hover:bg-gray-800 text-white'
                  }
                >
                  Login with Google
                </Button>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/about"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode 
                      ? 'text-gray-200 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                
                <button
                  onClick={toggleDarkMode}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode 
                      ? 'text-gray-200 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="h-5 w-5 mr-2" />
                      Mode Terang
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-2" />
                      Mode Gelap
                    </>
                  )}
                </button>

                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-700 border-t border-gray-100">
                      <div className="font-medium truncate mb-2">{user.email}</div>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="w-full justify-center"
                      >
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="px-3 py-2">
                    <Button 
                      onClick={() => {
                        signInWithGoogle()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-black hover:bg-gray-800 text-white"
                    >
                      Login with Google
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className={`flex-1 pt-16 ${
        isDarkMode ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {children}
      </main>

      {showFooter && (
        <footer className={`${
          isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'
        } mt-auto`}>
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © 2023 YT Analyzer. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}

