// hooks/use-mobile.ts
import * as React from 'react'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      // 1. Проверка User-Agent
      const ua = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile|phone/i.test(ua)
      
      // 2. Проверка на iPad (User-Agent может быть как у Mac)
      const isIPad = /macintosh/i.test(ua) && 'ontouchstart' in window && navigator.maxTouchPoints > 1
      
      // 3. Проверка touch-экрана (самый надежный признак мобильного устройства)
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1
      
      // 4. Проверка физического размера экрана (не зависит от поворота)
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      const isSmallScreen = screenWidth < 768 || screenHeight < 768
      
      // 5. Проверка соотношения сторон (на мобильных обычно > 1.5 в портрете)
      const aspectRatio = Math.max(screenWidth, screenHeight) / Math.min(screenWidth, screenHeight)
      const isMobileAspect = aspectRatio > 1.8
      
      // Результат: если есть touch И (User-Agent мобильный ИЛИ маленький экран ИЛИ iPad)
      return (hasTouch && (isMobileUA || isIPad || isSmallScreen || isMobileAspect))
    }
    
    setIsMobile(checkIsMobile())
    
    // Не слушаем resize, чтобы не менялось при повороте
  }, [])

  return isMobile
}

// Расширенная версия для более тонкой настройки
export function useMobileFull() {
  const [state, setState] = React.useState({
    isMobile: false,
    isTablet: false,
    isPhone: false,
    isLandscape: false,
    hasTouch: false,
    screenWidth: 0,
    screenHeight: 0
  })

  React.useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent.toLowerCase()
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1
      const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile|phone/i.test(ua)
      const isIPad = /macintosh/i.test(ua) && hasTouch && navigator.maxTouchPoints > 1
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      const isSmallScreen = screenWidth < 768 || screenHeight < 768
      const aspectRatio = Math.max(screenWidth, screenHeight) / Math.min(screenWidth, screenHeight)
      const isMobileAspect = aspectRatio > 1.8
      
      const isMobileDevice = hasTouch && (isMobileUA || isIPad || isSmallScreen || isMobileAspect)
      const isTablet = isMobileDevice && screenWidth >= 600 && screenWidth <= 1024
      const isPhone = isMobileDevice && screenWidth < 600
      const isLandscape = window.innerWidth > window.innerHeight
      
      setState({
        isMobile: isMobileDevice,
        isTablet,
        isPhone,
        isLandscape,
        hasTouch,
        screenWidth,
        screenHeight
      })
    }
    
    checkDevice()
    
    // Слушаем только orientationchange для обновления isLandscape
    const handleOrientationChange = () => {
      setState(prev => ({
        ...prev,
        isLandscape: window.innerWidth > window.innerHeight
      }))
    }
    
    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return state
}