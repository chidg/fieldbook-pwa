import React from "react"
import { usePouch } from "use-pouchdb"
import { useDataBaseContext, UserDetails, UserState } from "../contexts"

interface UserContextState {
  user?: UserState
  setUser: (arg0: UserFormDetails) => Promise<PouchDB.Core.Response>
  logout: () => void
}

type UserFormDetails = Pick<UserDetails, "email" | "initials" | "name"> & PouchDB.Core.IdMeta

const UserContext = React.createContext<UserContextState | undefined>(undefined)

const UserProvider: React.FC = ({ children }) => {
  const db = usePouch<UserState>()
  const { user, setUser } = useDataBaseContext()

  const saveUser = React.useCallback(
    async (item: UserFormDetails & {_rev?: string}) => {
      const newData: UserState = { type: "user" , ...item } 
      setUser(newData)
      if (user?._rev) {
        newData._rev = user._rev
      }
      return await db.put(newData)
    },
    [db, setUser, user?._rev]
  )

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: saveUser,
        logout: () => console.log("Should log out"),
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
