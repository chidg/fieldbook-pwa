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
            className="inline-flex items-center text-lg px-2 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white"
          >
            <span role="img" aria-label="Cog emoji">
              🤖
            </span>
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
//<div className="container mx-auto lg:px-10 mt-2"></div>

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
