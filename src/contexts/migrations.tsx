import React from "react"
import { usePouch } from "use-pouchdb"
import { UserState } from "../contexts"
import { runMigrations } from "../migrations"

interface MigrationsContextState {
  running: boolean
}


const MigrationsContext = React.createContext<MigrationsContextState>({ running: false })

const MigrationsProvider: React.FC = ({ children }) => {
  const db = usePouch<UserState>()
  const [running, setRunning] = React.useState(false)

  React.useEffect(() => {
    // Database migrations
    // check if migrations should be run
    console.log(process.env.REACT_APP_GIT_SHA)
    let version
    const newVersion = process.env.REACT_APP_GIT_SHA
    const localData = window.localStorage.getItem("fieldbook")
    if (localData) {
      version = JSON.parse(localData).version
    }
    const user = window.localStorage.getItem("user")

    if (user && newVersion !== version) {
      setRunning(true)

      runMigrations(db as any)
        .then(() => {
          window.localStorage.setItem(
            "fieldbook",
            JSON.stringify({ version: newVersion })
          )
        })
        .finally(() => {
          setRunning(false)
        })
    } else if (!user) {
      window.localStorage.setItem(
        "fieldbook",
        JSON.stringify({ version: newVersion })
      )
    }
  }, [db, setRunning])

  return (
    <MigrationsContext.Provider
      value={{
        running,
      }}
    >
      {children}
    </MigrationsContext.Provider>
  )
}

const useMigrationsContext = () => {
  const context = React.useContext(MigrationsContext)
  if (context === undefined) {
    throw new Error("useMigrationsContext must be used within a MigrationsProvider")
  }
  return context
}

export { MigrationsProvider, useMigrationsContext }
