import { useLocalStorage } from "@uidotdev/usehooks"
import React, { ReactNode } from "react"

export interface UserDetails {
  name?: string
  email?: string
}

interface Settings {
  watchLocation: boolean
}

interface UserContextState {
  user?: UserDetails
  settings: Settings
  loading: boolean
  setUser: (arg0: UserDetails) => void
  setSettings: (arg0: Settings) => void
  logout: () => void
}

const UserContext = React.createContext<UserContextState | undefined>(undefined)

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [localStoredValue, setLocalStoredValue] = useLocalStorage<
    UserDetails | undefined
  >("user", undefined)

  const [settingsLocalStoredValue, setSettingsLocalStoredValue] =
    useLocalStorage<Settings>("settings", { watchLocation: false })

  React.useEffect(() => {
    setLoading(false)
  }, [localStoredValue, settingsLocalStoredValue, setLoading])

  return (
    <UserContext.Provider
      value={{
        user: localStoredValue,
        settings: settingsLocalStoredValue,
        setSettings: setSettingsLocalStoredValue,
        loading,
        setUser: setLocalStoredValue,
        logout: () => setLocalStoredValue(undefined),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

const useUserContext = () => {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}

export { UserProvider, useUserContext }
