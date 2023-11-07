"use client"
import { useState, useEffect } from "react"

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    console.log("setting isClient to true")
    setIsClient(true)
  }, [])

  return isClient
}
