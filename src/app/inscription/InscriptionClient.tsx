'use client'

import dynamic from 'next/dynamic'

const Inscription = dynamic(() => import('@/pages/Inscription'), { ssr: false })

export default function InscriptionClient() {
  return <Inscription />
}

