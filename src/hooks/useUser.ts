import { UserDetails } from "@/contexts/user"
import { useLocalStorage } from "@uidotdev/usehooks"

export const useUser = () => {
  const [user, setUser] = useLocalStorage<UserDetails>("user", undefined)

  return { user, setUser }
}
