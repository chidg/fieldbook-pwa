import React from "react"
import {
  getAuth,
  updateProfile,
  User,
  createUserWithEmailAndPassword,
  UserCredential,
  updateEmail,
} from "firebase/auth"
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth"
import { useLocalStorage } from "app/hooks"
import { firebaseApp } from "../firebase-config"
import { useMetaContext } from "."

interface Settings {
  collectionPrefix?: string
  watchLocation: boolean
}

type CreateUserOptions = {
  email: string
  password: string
}
interface UserContextState {
  user?: User | null
  createUser: (args: CreateUserOptions) => Promise<UserCredential>
  signInUser: (email: string, password: string) => Promise<void>
  updateProfile: typeof updateProfile
  updateEmail: typeof updateEmail
  settings: Settings
  loading: boolean
  setSettings: (arg0: Partial<Settings>) => void
  signOut: () => void
}

const UserContext = React.createContext<UserContextState | undefined>(undefined)

const UserProvider: React.FC = ({ children }) => {
  const auth = getAuth(firebaseApp)
  const [user, loading] = useAuthState(auth)
  const { setLoading } = useMetaContext()
  const [settings, setSettings] = React.useState<Settings>({
    watchLocation: true,
  })

  React.useEffect(() => {
    setLoading(loading)
  }, [loading, setLoading])

  const [settingsLocalStoredValue, setSettingsLocalStoredValue] =
    useLocalStorage("settings", { watchLocation: false })

  const createUser = React.useCallback(
    ({ email, password }) =>
      createUserWithEmailAndPassword(auth, email, password),
    [auth]
  )

  React.useEffect(() => {
    setSettings(settingsLocalStoredValue)
  }, [settingsLocalStoredValue])

  return (
    <UserContext.Provider
      value={{
        user,
        createUser,
        signInUser: useSignInWithEmailAndPassword(auth)[0],
        updateProfile,
        updateEmail,
        settings,
        setSettings: (newSettings) =>
          setSettingsLocalStoredValue({ ...settings, ...newSettings }),
        loading,
        signOut: auth.signOut,
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
