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
import { Clock, PlayCircle, Eye, Copy, Share2 } from 'lucide-react'
import { useTheme } from '../context/theme-context'

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
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768
    }
    return false
  })
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([])
  const { isDarkMode } = useTheme()
  const [copyStatus, setCopyStatus] = useState(false)

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

  const handleCopy = async () => {
    try {
      const textToCopy = `
${videoDetails?.title}
Channel: ${videoDetails?.channelTitle}
Views: ${parseInt(videoDetails?.viewCount || '0').toLocaleString('id-ID')}

Hasil Analisis:
${summary}

Link: ${window.location.href}
    `.trim()
      
      await navigator.clipboard.writeText(textToCopy)
      setCopyStatus(true)
      setTimeout(() => setCopyStatus(false), 2000) // Reset setelah 2 detik
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: videoDetails?.title,
        text: `${videoDetails?.title}\n\nHasil Analisis:\n${summary}\n`,
        url: window.location.href
      })
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className={`fixed top-16 left-0 z-40 w-72 transform transition-transform duration-200 ease-in-out h-[calc(100vh-4rem)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } border-r`}>
          <div className="flex flex-col h-full">
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Riwayat Analisis</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className={`hover:bg-opacity-20 p-2 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <X className={`h-5 w-5 ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`} />
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
                    className={`w-full text-left p-4 border-b ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-700' 
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <h3 className={`font-medium mb-2 line-clamp-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <div className={`flex items-center gap-4 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDistanceToNow(new Date(item.timestamp), { 
                          addSuffix: true,
                          locale: id 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {parseInt(item.viewCount).toLocaleString('id-ID')} views
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed left-4 top-20 z-30 p-3 rounded-lg shadow-lg border transition-all duration-200 ${
            sidebarOpen ? 'hidden' : 'block'
          } ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
          aria-label="Buka riwayat analisis"
        >
          <Menu className={`h-6 w-6 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`} />
        </button>

        <div className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? 'ml-72' : 'ml-0'
        }`}>
          <div className="max-w-3xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
            <h1 className={`text-3xl font-bold text-center mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Analyze YouTube Video
            </h1>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Masukkan URL YouTube"
                  className={`flex-1 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' 
                      : 'bg-black text-white border-gray-300 placeholder:text-gray-300'
                  }`}
                />
                <Button 
                  type="submit"
                  disabled={loading}
                  className={isDarkMode 
                    ? 'bg-white hover:bg-gray-100 text-gray-900' 
                    : 'bg-black hover:bg-gray-800 text-white'
                  }
                >
                  {loading ? 'Menganalisis...' : 'Analisis'}
                </Button>
              </div>
            </form>

            {error && (
              <div className="bg-red-50 p-4 rounded-lg mb-12">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {summary && (
              <div className={`p-6 rounded-lg shadow-lg border mb-12 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <h2 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Informasi Video
                  </h2>
                  <div className="flex gap-2 relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className={`p-2 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:text-white border-gray-700 hover:border-gray-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {copyStatus && (
                      <div className={`absolute -bottom-8 right-0 text-sm px-2 py-1 rounded ${
                        isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                      }`}>
                        Sudah dicopy
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className={`p-2 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:text-white border-gray-700 hover:border-gray-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Judul</p>
                    <p className={`font-semibold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>{videoDetails?.title}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Channel</p>
                    <p className={`font-semibold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>{videoDetails?.channelTitle}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Tanggal Upload</p>
                    <p className={`font-semibold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {videoDetails?.publishedAt ? 
                        new Date(videoDetails.publishedAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '-'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Views</p>
                    <p className={`font-semibold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {videoDetails?.viewCount ? 
                        parseInt(videoDetails.viewCount).toLocaleString('id-ID') : '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className={`text-2xl font-bold mb-4 mt-8 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Hasil Analisis
                  </h2>
                  <div className={`prose prose-lg max-w-none p-6 rounded-lg ${
                    isDarkMode ? 'bg-gray-900 prose-invert' : 'bg-gray-50'
                  }`}>
                    <div className={`whitespace-pre-wrap leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>
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

