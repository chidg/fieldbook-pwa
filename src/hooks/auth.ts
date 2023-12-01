import { useEffect } from "react"
import { redirect } from "react-router-dom"
import { useUserContext } from "@/contexts/user"

export const useRedirectToLogin = () => {
  const { user } = useUserContext()

  useEffect(() => {
    if (!user) redirect("/login")
  }, [user])
}
