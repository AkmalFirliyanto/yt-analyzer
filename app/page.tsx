'use client'

import Layout from './components/layout'
import { Button } from "./components/ui/button"
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-16">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Analyze YouTube Videos <br/>with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dapatkan ringkasan singkat dan poin-poin penting dari video YouTube dalam hitungan detik.
          </p>
          <div className="mt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800 text-white"
              onClick={() => router.push('/about')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

