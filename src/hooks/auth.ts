import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "@/contexts/user"

export const useRedirectToLogin = () => {
  const { user } = useUserContext()
  const nav = useNavigate()

  useEffect(() => {
    if (!user) nav("/login")
  }, [user])
}
