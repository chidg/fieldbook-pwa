import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user"

export const useRedirectToLogin = () => {
  const { user } = useUserContext()

  const router = useRouter()
  useEffect(() => {
    if (!user) router.push("/login")
  }, [user])
}
