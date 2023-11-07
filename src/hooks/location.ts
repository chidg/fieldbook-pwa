"use client"
import { useEffect, useState, useMemo } from "react"
import { useUserContext } from "@/contexts"
import { useIsClient } from "./useIsClient"

export const useGeoLocation = (): [
  GeolocationCoordinates | undefined,
  number | undefined
] => {
  const {
    settings: { watchLocation },
  } = useUserContext()

  const isClient = useIsClient()

  const [geoLocation, setGeoLocation] = useState<
    GeolocationCoordinates | undefined
  >(undefined)
  const [geoLocationWarning, setGeoLocationWarning] = useState<
    number | undefined
  >(undefined)

  useEffect(() => {
    let watchId: number
    if (!isClient) return
    if (watchLocation) {
      watchId = navigator.geolocation.watchPosition(
        ({ coords }) => {
          // Necessary to do this transformation because the coords object is a prototype with getters rather than a normal object
          setGeoLocation({
            accuracy: coords.accuracy,
            altitude: coords.altitude,
            altitudeAccuracy: coords.altitudeAccuracy,
            heading: coords.heading,
            latitude: coords.latitude,
            longitude: coords.longitude,
            speed: coords.speed,
          })
        },
        ({ code }) => setGeoLocationWarning(code),
        { enableHighAccuracy: true }
      )
    } else {
      navigator.geolocation.getCurrentPosition(({ coords }) =>
        setGeoLocation({
          accuracy: coords.accuracy,
          altitude: coords.altitude,
          altitudeAccuracy: coords.altitudeAccuracy,
          heading: coords.heading,
          latitude: coords.latitude,
          longitude: coords.longitude,
          speed: coords.speed,
        })
      )
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchLocation])

  return [geoLocation, geoLocationWarning]
}

export const useGeoLocationDisplay = () => {
  const [geoLocation, geoLocationWarning] = useGeoLocation()
  const isClient = useIsClient()
  return useMemo(() => {
    if (!isClient) return
    if (geoLocation) {
      return `${geoLocation.latitude.toPrecision(
        6
      )}, ${geoLocation.longitude.toPrecision(7)}`
    } else if (geoLocationWarning) {
      switch (geoLocationWarning) {
        case 1:
          return "Permission denied. Please check your permissions to use the location functionality."
        default:
          return "Unable to get location"
      }
    }
    return "Accessing location..."
  }, [geoLocation, geoLocationWarning, isClient])
}

export const useHasGeoLocationPermission = () => {
  const [geoLocation, geoLocationWarning] = useGeoLocation()
  const isClient = useIsClient()
  return useMemo(() => {
    if (!isClient) return
    if (geoLocation) return true
    if (geoLocationWarning) return false
    return null
  }, [geoLocation, geoLocationWarning, isClient])
}
