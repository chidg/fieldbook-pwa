import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
  Link,
} from "react-router-dom"


import {
  useUserContext,
} from "./contexts"
import UserForm from './components/user-form'
import DataList from './components/item-list'
import ItemFormUpdate from './components/item-form-update'
import ItemFormCreate from './components/item-form-create'
import LoadingScreen from './components/loading-screen'
import SettingsUpdate from './components/settings-form'

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { user, loading } = useUserContext()

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-decorgreen-600 p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            Fieldbook 📒
          </span>
        </div>
        <div className="items-right align-middle">
          <Link
            to="/settings"
            className="inline-flex items-center text-lg px-2 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:bg-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto lg:px-10 mt-2">
        <Route
          {...rest}
          render={({ location }) => {
            if (loading) return <LoadingScreen />
            else if (user) return children
            else return <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          }}
        />
      </div>
    </>
  )
}

function App() {
  
  return (
    <div className="mx-auto h-screen bg-gradient-to-br from-purple-600 to-blue-200">
      <Router>
        <Switch>
          <Route path="/login">
            <nav className="flex items-center justify-between flex-wrap bg-decorgreen-600 p-4">
              <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">
                  Fieldbook 📒
                </span>
              </div>
            </nav>
            <div className="md:w-2/3 sm:w-screen mx-auto lg:px-10 mt-2">
              <UserForm />
            </div>  
          </Route>
          <PrivateRoute exact path="/">
            <DataList />
          </PrivateRoute>
          <PrivateRoute exact path="/settings">
            <SettingsUpdate />
          </PrivateRoute>
          <PrivateRoute exact path="/new">
           <ItemFormCreate />
          </PrivateRoute>
          <PrivateRoute exact path="/:id/edit">
           <ItemFormUpdate />
          </PrivateRoute>
        </Switch>
      </Router>
    </div>
  )
}

export default App
