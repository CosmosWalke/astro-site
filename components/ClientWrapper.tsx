'use client'

import { AudioPlayer } from './AudioPlayer'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AudioPlayer />
    </>
  )
}