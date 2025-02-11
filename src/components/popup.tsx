import { DataItem } from "@/contexts"
import { taxaOptions } from "@/contexts/data"
import { useState } from "react"
import config from "@/config.json"
import { Popup as ReactMapPopup } from "react-map-gl"

export const useShowPopup = () => {
  return useState<DataItem | null>(null)
}

export const Popup = ({
  showPopup,
  setShowPopup,
}: {
  showPopup: DataItem | null
  setShowPopup: (arg: DataItem | null) => void
}) => {
  if (!showPopup) return null
  const taxonName = taxaOptions[parseInt(showPopup.taxon)].name
  const density = config.densities[parseInt(showPopup.density)]
  return (
    <ReactMapPopup
      onClose={() => setShowPopup(null)}
      latitude={showPopup.location!.latitude}
      longitude={showPopup.location!.longitude}
    >
      <div className="flex flex-col gap-1 text-black">
        <span>{taxonName}</span>
        <span>{density}</span>
        <span>{new Date(showPopup.timestamp).toLocaleString()}</span>
      </div>
    </ReactMapPopup>
  )
}
