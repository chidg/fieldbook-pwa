"use client"
import UserForm from "@/components/user-form"
import { useUserContext } from "@/contexts"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default () => {
  const { user } = useUserContext()
  const { replace } = useRouter()
  useEffect(() => {
    if (user) {
      replace("/")
    }
  }, [user, replace])

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            Fieldbook 📒
          </span>
        </div>
      </nav>
      <div className="md:w-2/3 sm:w-screen mx-auto lg:px-10 mt-2 ">
        <UserForm />
      </div>
    </>
  )
}
