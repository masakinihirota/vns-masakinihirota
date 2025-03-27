'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  // データの取得
  // データの加工
  const [message, setMessage] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/hello')
      const { message } = await res.json()
      setMessage(message)
    }
    fetchData()
  }, [])

  if (!message) return <p>Loading...</p>

  return <p>{message}</p>
}
