import React from "react"

const LoadingScreen = () => (
  <>
    <nav className="flex items-center justify-between flex-wrap p-4">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">
          Fieldbook 📒
        </span>
      </div>
    </nav>

    <div className="container mx-auto lg:px-10 mt-2"></div>
    <div className="grid max-h-screen place-items-center">
      <div className="loader ease-linear rounded-full border-8 border-gray-200 h-64 w-64"></div>
    </div>
  </>
)

export default LoadingScreen
