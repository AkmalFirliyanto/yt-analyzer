import { NextResponse } from 'next/server'
import { adminDb } from '../../lib/firebase-admin'

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('X-User-Id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analysesRef = adminDb.collection(`users/${userId}/analyses`)
    const snapshot = await analysesRef
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const analyses = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.videoDetails?.title || 'Untitled',
        timestamp: data.createdAt,
        videoId: data.videoId,
        channelTitle: data.videoDetails?.channelTitle,
        viewCount: data.videoDetails?.viewCount
      }
    })

    return NextResponse.json(analyses)
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil riwayat' },
      { status: 500 }
    )
  }
} 