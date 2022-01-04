import React from "react"

type StoredData = {}

type ReturnType<T> = [T, (value: T) => void]

export function useLocalStorage<T extends StoredData>(
  key: string,
  initialValue: T
): ReturnType<T> {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [localStoredValue, setStoredValue] = React.useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setLocalStoredValue = React.useCallback(
    (value: T) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(localStoredValue) : value
        // Save state
        setStoredValue(valueToStore)
        // Save to local storage
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error)
      }
    },
    [key, localStoredValue]
  )

  return [localStoredValue, setLocalStoredValue]
}
