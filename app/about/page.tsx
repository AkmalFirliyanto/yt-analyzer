'use client'

import Layout from '../components/layout'
import { Button } from "../components/ui/button"
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/auth-context'

export default function About() {
  const router = useRouter()
  const { user, signInWithGoogle } = useAuth()

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
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Tentang YT Analyzer
        </h1>

        <div className="space-y-12">
          {/* Bagian Penjelasan Utama */}
          <section className="prose lg:prose-lg mx-auto">
            <p className="text-xl text-gray-800 leading-relaxed font-medium">
              YT Analyzer adalah alat yang membantu Anda mengekstrak informasi penting dari video YouTube menggunakan kecerdasan buatan (AI). Dapatkan ringkasan dan poin kunci dari video tanpa perlu menonton keseluruhan konten.
            </p>
          </section>

          {/* Fitur-fitur */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">🚀 Analisis Cepat</h3>
              <p className="text-lg text-gray-700">
                Dapatkan ringkasan video dalam hitungan detik, menghemat waktu Anda dalam memahami konten.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">🎯 Poin Penting</h3>
              <p className="text-lg text-gray-700">
                Ekstrak poin-poin kunci dan informasi penting dari video secara otomatis.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">📊 Riwayat Analisis</h3>
              <p className="text-lg text-gray-700">
                Simpan dan akses kembali hasil analisis video Anda kapan saja.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">🔒 Aman & Pribadi</h3>
              <p className="text-lg text-gray-700">
                Login dengan akun Google Anda untuk menyimpan analisis secara aman.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <Button 
              size="lg"
              onClick={handleStartAnalyze}
              className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-6 rounded-xl font-semibold"
            >
              {user ? 'Mulai Analisis' : 'Login untuk Mulai'}
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  )
} 