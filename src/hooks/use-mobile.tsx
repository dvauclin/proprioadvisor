"use client";

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Retourner false par défaut pendant l'hydratation pour éviter les erreurs
  if (!hasMounted) {
    return false
  }

  return !!isMobile
}

export function useSafeAreas() {
  const [safeAreas, setSafeAreas] = React.useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const updateSafeAreas = () => {
      // Get safe area values from CSS environment variables
      const style = getComputedStyle(document.documentElement)
      const top = parseInt(style.getPropertyValue('--safe-area-inset-top')) || 0
      const right = parseInt(style.getPropertyValue('--safe-area-inset-right')) || 0
      const bottom = parseInt(style.getPropertyValue('--safe-area-inset-bottom')) || 0
      const left = parseInt(style.getPropertyValue('--safe-area-inset-left')) || 0
      
      setSafeAreas({ top, right, bottom, left })
    }

    updateSafeAreas()
    
    // Update on orientation change
    window.addEventListener('orientationchange', updateSafeAreas)
    window.addEventListener('resize', updateSafeAreas)
    
    return () => {
      window.removeEventListener('orientationchange', updateSafeAreas)
      window.removeEventListener('resize', updateSafeAreas)
    }
  }, [])

  if (!hasMounted) {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  return safeAreas
}

