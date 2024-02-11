import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Outlet,
  Navigate,
} from "react-router-dom"

import { useGoogleAnalytics, useRedirectToLogin } from "@/hooks"
import UserForm from "@/components/user-form"
import {
  ItemList,
  ItemFormUpdate,
  ItemFormCreate,
  ItemDetail,
} from "@/components/data"

import SettingsUpdate from "@/components/settings-form"
import { useDataContext } from "./contexts"

const AuthWrapper = () => {
  useGoogleAnalytics()
  useRedirectToLogin()
  const { hasNewData } = useDataContext()

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            Fieldbook 📒
          </span>
        </div>
        <div className="flex gap-2 items-right align-middle">
          {hasNewData && (
            <Link
              to="/settings?export"
              className="inline-flex items-center text-lg px-2 py-2 leading-none border rounded text-green-300 border-green-300 hover:border-transparent hover:bg-purple-600"
              title="New data reminder"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-send"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </Link>
          )}
          <Link
            to="/settings"
            className="inline-flex items-center text-lg px-2 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:bg-purple-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto lg:px-10 mt-2">
        <Outlet />
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <>
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
            </>
          }
        />
        <Route path="/" element={<AuthWrapper />}>
          <Route index element={<ItemList />} />
          <Route path="settings">
            <Route index element={<SettingsUpdate />} />
            <Route
              path="user"
              element={
                <div className="md:w-2/3 sm:w-screen mx-auto lg:px-10 mt-2">
                  <UserForm />
                </div>
              }
            />
          </Route>
          <Route path="data">
            <Route path="new" element={<ItemFormCreate />} />
            <Route path=":id/" element={<ItemDetail />} />
            <Route path=":id/edit" element={<ItemFormUpdate />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
