'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth-context'
import { db } from '../lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import Layout from '../components/layout'

interface Analysis {
  id: string;
  createdAt: Date;
  [key: string]: any; // untuk properti lain yang mungkin ada
}

export default function History() {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState<Analysis[]>([])

  useEffect(() => {
    if (user) {
      const fetchAnalyses = async () => {
        const q = query(
          collection(db, `users/${user.uid}/analyses`),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        setAnalyses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[])
      }
      fetchAnalyses()
    }
  }, [user])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Riwayat Analisis</h1>
        {/* Tampilkan daftar analisis */}
      </div>
    </Layout>
  )
} 