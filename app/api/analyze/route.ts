import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { adminDb } from '../../lib/firebase-admin'

const youtube = google.youtube('v3')

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('X-User-Id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = await req.json()

    // Gunakan admin SDK untuk operasi Firestore
    const userAnalysisRef = adminDb.doc(`users/${userId}/analyses/${videoId}`)
    
    try {
      const analysisDoc = await userAnalysisRef.get()
      if (analysisDoc.exists) {
        const data = analysisDoc.data()
        return NextResponse.json({
          summary: data?.summary,
          videoDetails: data?.videoDetails
        })
      }
    } catch (error) {
      console.error('Error checking existing analysis:', error)
    }

    // Lakukan analisis baru
    const videoResponse = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ['snippet', 'statistics'],
      id: [videoId]
    })

    const video = videoResponse.data.items?.[0]
    if (!video) {
      return NextResponse.json(
        { error: 'Video tidak ditemukan' },
        { status: 404 }
      )
    }

    const videoInfo = `
Judul: ${video.snippet?.title}
Channel: ${video.snippet?.channelTitle}
Tanggal Upload: ${video.snippet?.publishedAt}
Views: ${video.statistics?.viewCount}
Deskripsi: ${video.snippet?.description}
      `.trim()

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          {
            role: "system",
            content: `Kamu adalah asisten yang sangat ahli dalam membedah dan menganalisis konten video yang detail dan mendalam.
            Wajib menggunakan bahasa Indonesia yang sopan dan profesional.
            Analisis video dengan struktur berikut:

            1. RINGKASAN KONTEN
            - Gambaran umum video minimal 1-2 paragraf

            2. ANALISIS KONTEN
            - Topik utama dan subtopik yang dibahas
            - Argumen atau penjelasan kunci
            - Data atau fakta penting yang disebutkan
            - Contoh atau studi kasus yang digunakan

            3. NILAI EDUKATIF
            - Pelajaran utama yang bisa dipetik
            - Aplikasi praktis dari informasi
            - Target audiens yang cocok

            4. REKOMENDASI
            - Siapa yang sebaiknya menonton video ini
            - Video/sumber terkait yang disarankan

            Berikan analisis yang objektif dan terstruktur. Fokus pada substansi, abaikan elemen promosi/iklan/apalagi judi online.`
          },
          {
            role: "user",
            content: `Tolong analisis video YouTube ini secara mendalam:\n\n${videoInfo}`
          }
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('Mistral API error')
    }

    const data = await response.json()
    const summary = data.choices[0]?.message?.content || 'Tidak dapat menghasilkan ringkasan'

    const videoDetails = {
      title: video.snippet?.title,
      channelTitle: video.snippet?.channelTitle,
      publishedAt: video.snippet?.publishedAt,
      viewCount: video.statistics?.viewCount,
    }

    // Simpan menggunakan admin SDK
    try {
      // Buat/update dokumen user
      await adminDb.doc(`users/${userId}`).set({
        email: req.headers.get('X-User-Email') || '',
        updatedAt: new Date().toISOString()
      }, { merge: true })

      // Simpan analisis
      await userAnalysisRef.set({
        videoId,
        summary,
        videoDetails,
        createdAt: new Date().toISOString()
      })
    } catch (firebaseError) {
      console.error('Firebase Error:', firebaseError)
    }

    // Selalu return hasil analisis
    return NextResponse.json({ summary, videoDetails })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menganalisis video' },
      { status: 500 }
    )
  }
} 