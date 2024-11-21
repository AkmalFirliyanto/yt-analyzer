'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/auth-context'
import Layout from '../components/layout'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Menu, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { Clock, PlayCircle, Eye } from 'lucide-react'

interface AnalysisHistory {
  id: string;
  title: string;
  timestamp: string;
  videoId: string;
  channelTitle: string;
  viewCount: string;
}

export default function Analyze() {
  const { user } = useAuth()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoDetails, setVideoDetails] = useState<{
    title?: string;
    channelTitle?: string;
    publishedAt?: string;
    viewCount?: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const response = await fetch('/api/history', {
            headers: {
              'X-User-Id': user.uid,
            }
          })
          if (response.ok) {
            const data = await response.json()
            setAnalysisHistory(data)
          }
        } catch (error) {
          console.error('Error fetching history:', error)
        }
      }
    }
    fetchHistory()
  }, [user, summary])

  if (!user) {
    return null
  }

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      setSummary('')
      
      const videoId = extractVideoId(url)
      if (!videoId) {
          setError('URL YouTube tidak valid')
          return
        }

    try {
      setLoading(true)
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.uid || '',
          'X-User-Email': user?.email || '',
        },
        body: JSON.stringify({ videoId }),
      })

      if (!response.ok) {
        throw new Error('Gagal menganalisis video')
      }

      const data = await response.json()
      setSummary(data.summary)
      setVideoDetails(data.videoDetails)
    } catch (err) {
      setError('Terjadi kesalahan saat menganalisis video')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = async (videoId: string) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.uid || '',
          'X-User-Email': user?.email || '',
        },
        body: JSON.stringify({ videoId }),
      })

      if (!response.ok) {
        throw new Error('Gagal memuat analisis')
      }

      const data = await response.json()
      setSummary(data.summary)
      setVideoDetails(data.videoDetails)
      
      // Optional: tutup sidebar setelah memilih item
      setSidebarOpen(false)
    } catch (err) {
      setError('Terjadi kesalahan saat memuat analisis')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className={`fixed top-16 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out h-[calc(100vh-4rem)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Riwayat Analisis</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {analysisHistory.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Belum ada riwayat analisis
                </div>
              ) : (
                analysisHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleHistoryClick(item.videoId)}
                    className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors duration-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <PlayCircle className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.channelTitle}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(item.timestamp), {
                                addSuffix: true,
                                locale: id
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {parseInt(item.viewCount).toLocaleString('id-ID')} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed left-4 top-20 z-30 p-2 rounded-md bg-white shadow-lg border ${
            sidebarOpen ? 'hidden' : 'block'
          }`}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? 'ml-72' : 'ml-0'
        }`}>
          <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Analyze YouTube Video
            </h1>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Masukkan URL YouTube"
                  className="flex-grow"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? 'Menganalisis...' : 'Analisis'}
                </Button>
              </div>
            </form>

            {error && (
              <div className="bg-red-50 p-4 rounded-lg mb-8">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {summary && (
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <div className="mb-8 pb-6 border-b-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Informasi Video
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm mb-1">Judul</p>
                      <p className="font-semibold text-gray-900">{videoDetails?.title}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm mb-1">Channel</p>
                      <p className="font-semibold text-gray-900">{videoDetails?.channelTitle}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm mb-1">Tanggal Upload</p>
                      <p className="font-semibold text-gray-900">
                        {videoDetails?.publishedAt ? 
                          new Date(videoDetails.publishedAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm mb-1">Views</p>
                      <p className="font-semibold text-gray-900">
                        {videoDetails?.viewCount ? 
                          parseInt(videoDetails.viewCount).toLocaleString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Hasil Analisis
                  </h2>
                  <div className="prose prose-lg max-w-none bg-gray-50 p-6 rounded-lg">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {summary}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

