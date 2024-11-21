'use client'

import Link from 'next/link'
import { useAuth } from '../context/auth-context'
import { Button } from './ui/button'

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  const { user, signInWithGoogle, signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-800">YT Analyzer</span>
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-gray-900"
              >
                About
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => signInWithGoogle()}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Login with Google
                </Button>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && (
        <footer className="bg-white mt-auto">
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

