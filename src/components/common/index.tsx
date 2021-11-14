import React from "react"

// type PhotosGridProps = {
//   photos: PouchDB.Core.FullAttachment[]
// }

// export const PhotoGrid: React.FC<PhotosGridProps> = ({ photos }) => (
//   <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
//     {photos.map((photo, index: number) => (
//       <div
//         key={`photo-${index}`}
//         className="square-image-container border-2 rounded border-gray-500"
//       >
//         <img src={`data:${photo.content_type};base64, ${photo.data}`} alt="" />
//       </div>
//     ))}
//   </div>
// )

type SpinningSubmitFormButtonProps = {
  disabled: boolean
  spinning: boolean
  title?: string
}

export const SpinningSubmitFormButton: React.FC<SpinningSubmitFormButtonProps> =
  ({ disabled, spinning, title = "Submit" }) => (
    <button
      type="submit"
      disabled={disabled}
      className="border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
    >
      {!spinning && <span>{title}</span>}
      {spinning && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </button>
  )
