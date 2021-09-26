import React from "react"
import { useLocalStorage } from "../hooks"

interface UserDetails {
  initials?: string
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

const UserContext = React.createContext<
  UserContextState | undefined
>(undefined)

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<UserDetails | undefined>(undefined)
  const [settings, setSettings] = React.useState<Settings>({ watchLocation: false })
  const [loading, setLoading] = React.useState<boolean>(true)
  const [localStoredValue, setLocalStoredValue] = useLocalStorage('user', undefined)
  const [settingsLocalStoredValue, setSettingsLocalStoredValue] = useLocalStorage('settings', { watchLocation: false })

  React.useEffect(() => {
    setUser(localStoredValue)
    setSettings(settingsLocalStoredValue)
    setLoading(false)
  }, [localStoredValue, settingsLocalStoredValue, setLoading, setUser])
  
  return (
    <UserContext.Provider
      value={{
        user,
        settings,
        setSettings: setSettingsLocalStoredValue,
        loading,
        setUser: setLocalStoredValue,
        logout: () => setLocalStoredValue(undefined)
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

const useUserContext = () => {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error(
      "useUserContext must be used within a UserProvider"
    )
  }
  return context
}

export { UserProvider, useUserContext }
