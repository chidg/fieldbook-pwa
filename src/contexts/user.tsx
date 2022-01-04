import React from "react"
import { useAuthStateChange, useClient } from "react-supabase"
import { User } from "@supabase/gotrue-js"
import { useLocalStorage } from "app/hooks"
import { useMetaContext } from "./meta"
interface Settings {
  collectionPrefix?: string
  watchLocation: boolean
}

interface UserContextState {
  user?: User | null
  settings: Settings
  setUser: (user: User) => void
  setSettings: (arg0: Partial<Settings>) => void
}

const UserContext = React.createContext<UserContextState | undefined>(undefined)

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<User>()
  const { setLoading } = useMetaContext()
  const client = useClient()
  const [settings, _setSettings] = React.useState<Settings>({
    watchLocation: true,
  })
  const [settingsLocalStoredValue, setSettingsLocalStoredValue] =
    useLocalStorage<Settings>("settings", { watchLocation: false })

  React.useEffect(() => {
    const session = client.auth.session()
    if (JSON.stringify(session?.user) !== JSON.stringify(user)) {
      setUser(session?.user || undefined)
    }
    setLoading(false)
  }, [client.auth, setLoading, user])

  useAuthStateChange((event, session) => {
    if (JSON.stringify(session?.user) !== JSON.stringify(user)) {
      setUser(session?.user || undefined)
    }
  })

  React.useEffect(() => {
    _setSettings(settingsLocalStoredValue)
  }, [settingsLocalStoredValue])

  const setSettings = React.useCallback(
    (newSettings) =>
      setSettingsLocalStoredValue({ ...settings, ...newSettings }),
    [setSettingsLocalStoredValue, settings]
  )

  const memoisedState = React.useMemo(
    () => ({
      user,
      setUser,
      settings,
      setSettings,
    }),
    [user, setUser, settings, setSettings]
  )

  return (
    <UserContext.Provider value={memoisedState}>
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

UserProvider.whyDidYouRender = true

export { UserProvider, useUserContext }
