'use client'

export function ScrollStyles() {
  return (
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
      
      #universe, #comic, #products, #media {
        scroll-margin-top: 80px;
      }
    `}</style>
  )
}