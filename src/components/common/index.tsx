import React from "react"
import PouchDB from "pouchdb-browser"

type PhotosGridProps = {
  photos: PouchDB.Core.FullAttachment[]
}

export const PhotoGrid: React.FC<PhotosGridProps> = ({ photos }) => (
  <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
    {photos.map((photo, index: number) => (
      <div
        key={`photo-${index}`}
        className="square-image-container border-2 rounded border-gray-500"
      >
        <img src={`data:${photo.content_type};base64, ${photo.data}`} alt="" />
      </div>
    ))}
  </div>
)
