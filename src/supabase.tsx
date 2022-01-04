import { createClient } from "@supabase/supabase-js"
import { Provider } from "react-supabase"

const client = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
)

const SupabaseProvider: React.FC = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

export default SupabaseProvider
