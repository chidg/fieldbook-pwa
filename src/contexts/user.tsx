import React from "react"
import { usePouch, useFind } from "use-pouchdb"
import { useMetaContext, useDataBaseContext } from "../contexts"
import useDeepCompareEffect from "use-deep-compare-effect"

interface UserDetails {
  _id: string
  initials?: string
  name?: string
  email?: string
}

export type NewUserDoc = PouchDB.Core.NewDocument<UserDetails>
export type ExistingUserDoc = PouchDB.Core.ExistingDocument<UserDetails>
interface UserContextState {
  user?: ExistingUserDoc
  setUser: (arg0: UserDetails) => void
  logout: () => void
}

const UserContext = React.createContext<UserContextState | undefined>(undefined)

const UserProvider: React.FC = ({ children }) => {
  const db = usePouch<UserDetails>()
  const { user } = useDataBaseContext()

  const saveUser = React.useCallback(
    async (item: UserDetails & { _rev?: string }) => {
      const newData = { ...item, type: "user" }
      if (user?._rev) {
        newData._rev = user._rev
      }
      await db.put(newData)
    },
    [db, user?._rev]
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
