"use client"
import { useState, useCallback, useEffect } from "react"
import { useIsClient } from "./useIsClient"

export const useLocalStorage = <T extends {} | undefined>(
  key: string,
  initialValue?: T
) => {
  const isClient = useIsClient()

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [localStoredValue, setStoredValue] = useState<T>()

  useEffect(() => {
    if (!isClient) {
      setStoredValue(initialValue)
      return
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      console.log({ x: "insideSetStateFn", isClient, item, key })
      // Parse stored json or if none return initialValue
      setStoredValue(item ? JSON.parse(item) : initialValue)
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      setStoredValue(initialValue)
    }
  }, [isClient, setStoredValue, initialValue, key])

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setLocalStoredValue = useCallback(
    (value?: T | ((prevState: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(localStoredValue as T) : value
        // Save state
        setStoredValue(valueToStore)
        // Save to local storage
        if (valueToStore === undefined && isClient) {
          window.localStorage.removeItem(key)
        } else {
          isClient &&
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error)
      }
    },
    [isClient]
  )

  return [localStoredValue, setLocalStoredValue] as [
    T,
    typeof setLocalStoredValue
  ]
}
