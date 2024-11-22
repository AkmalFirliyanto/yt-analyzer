'use client'

import Layout from '../components/layout'
import { Button } from "../components/ui/button"
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/auth-context'
import { useTheme } from '../context/theme-context'


export default function About() {
  const router = useRouter()
  const { user, signInWithGoogle } = useAuth()
  const { isDarkMode } = useTheme()
  const handleStartAnalyze = async () => {
    if (user) {
      router.push('/analyze')
    } else {
      try {
        await signInWithGoogle()
        router.push('/analyze')
      } catch (error) {
        console.error('Login error:', error)
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className={`text-4xl font-bold mb-8 text-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Tentang YT Analyzer
        </h1>

        <div className="space-y-12">
          <section className="prose lg:prose-lg mx-auto dark:prose-invert">
            <p className={`text-xl leading-relaxed font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>
              YT Analyzer adalah alat yang membantu Anda mengekstrak informasi penting dari video YouTube menggunakan kecerdasan buatan (AI). Dapatkan ringkasan dan poin kunci dari video tanpa perlu menonton keseluruhan konten.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Analisis Cepat',
                description: 'Dapatkan ringkasan video dalam hitungan detik, menghemat waktu Anda dalam memahami konten.'
              },
              {
                icon: '🎯',
                title: 'Poin Penting',
                description: 'Ekstrak poin-poin kunci dan informasi penting dari video secara otomatis.'
              },
              {
                icon: '📊',
                title: 'Riwayat Analisis',
                description: 'Simpan dan akses kembali hasil analisis video Anda kapan saja.'
              },
              {
                icon: '🔒',
                title: 'Aman & Pribadi',
                description: 'Login dengan akun Google Anda untuk menyimpan analisis secara aman.'
              }
            ].map((feature, index) => (
              <div key={index} className={`p-8 rounded-lg shadow-lg border transition-shadow hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <h3 className="text-2xl font-bold mb-4">
                  {feature.icon} {feature.title}
                </h3>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </section>

          <section className="text-center">
            <Button 
              size="lg"
              onClick={handleStartAnalyze}
              className={`text-lg px-8 py-6 rounded-xl font-semibold ${
                isDarkMode 
                  ? 'bg-white hover:bg-gray-100 text-gray-900' 
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              {user ? 'Mulai Analisis' : 'Login untuk Mulai'}
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  )
} 