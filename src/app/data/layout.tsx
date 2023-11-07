import React, { FC } from "react"
import { PrivateLayout } from "@/components/PrivateLayout"

const DataLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <PrivateLayout>{children}</PrivateLayout>
)

export default DataLayout
