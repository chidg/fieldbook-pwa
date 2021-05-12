import React from "react"
import { useLocalStorage } from "../hooks"

interface UserDetails {
  initials?: string
  name?: string
  email?: string
}


interface UserContextState {
  user?: UserDetails
  loading: boolean
  setUser: (arg0: UserDetails) => void
}

const UserContext = React.createContext<
  UserContextState | undefined
>(undefined)

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<UserDetails | undefined>(undefined)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [localStoredValue, setLocalStoredValue] = useLocalStorage('user', undefined)

  React.useEffect(() => {
    setUser(localStoredValue)
    setLoading(false)
  }, [localStoredValue, setLoading, setUser])
  
  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser: setLocalStoredValue,
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
