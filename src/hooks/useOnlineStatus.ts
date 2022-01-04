import { useState } from "react"

export const useOnlineStatus = () => {
  const [online, setOnline] = useState(window.navigator.onLine)
  window.addEventListener("offline", () => setOnline(false))
  window.addEventListener("online", () => setOnline(true))

  return online
}
