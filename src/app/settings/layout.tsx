import React, { FC } from "react"
import { PrivateLayout } from "@/components/PrivateLayout"

const SettingsLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <PrivateLayout>{children}</PrivateLayout>
)

export default SettingsLayout
