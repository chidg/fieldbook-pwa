import { useRef, useEffect } from "react"
export { useLocalStorage } from "./local-storage"
export { useGoogleAnalytics } from "./analytics"
export { useMigrations } from "./migrations"
export { useCollectionInstance } from "./useCollectionInstance"

export const useNoRenderRef = (currentValue: any) => {
  const ref = useRef(currentValue)
  ref.current = currentValue
  return ref
}

export const usePrevious = (value: any) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
