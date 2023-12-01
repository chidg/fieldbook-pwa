import { useNavigate } from "react-router-dom"

export const useBack = () => {
  const nav = useNavigate()
  return () => nav(-1)
}
