// hooks/useIsMobile.ts
'use client';

import { useEffect, useState } from 'react';

// Глобальный флаг
let globalIsMobile: boolean | null = null;

const checkIsMobile = () => {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
  const isIPad = /macintosh/i.test(ua) && hasTouch && 'ontouchstart' in window;
  return (hasTouch || isMobileUA || isIPad);
};

// Экспортируем хук с тем же именем, что и старый
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(globalIsMobile ?? false);

  useEffect(() => {
    if (globalIsMobile === null) {
      globalIsMobile = checkIsMobile();
      setIsMobile(globalIsMobile);
    }
  }, []);

  return isMobile;
}