import { useEffect, useState, useMemo } from "react"
import { useUserContext } from "@/contexts"

export const useGeoLocation = (): [
  GeolocationCoordinates | undefined,
  number | undefined
] => {
  const {
    settings: { watchLocation },
  } = useUserContext()

  const [geoLocation, setGeoLocation] = useState<GeolocationCoordinates>()

  const [geoLocationWarning, setGeoLocationWarning] = useState<
    number | undefined
  >(undefined)

  useEffect(() => {
    let watchId: number

    const onSuccess: PositionCallback = ({ coords }) => {
      setGeoLocation({
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed,
      })
    }

    const onError: PositionErrorCallback = ({ code }) =>
      setGeoLocationWarning(code)

    if (watchLocation) {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
      })
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError)
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

  return useMemo(() => {
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
  }, [geoLocation, geoLocationWarning])
}

export const useHasGeoLocationPermission = () => {
  const [permStatus, setPermStatus] = useState<
    "granted" | "denied" | "prompt"
  >()

  useEffect(() => {
    const eventListener: EventListener = (e) =>
      setPermStatus((e.target as PermissionStatus).state)
    navigator.permissions.query({ name: "geolocation" }).then((x) => {
      setPermStatus(x.state)
      x.addEventListener("change", eventListener)
    })

    return () => {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((x) => x.removeEventListener("change", eventListener))
    }
  }, [])

  return permStatus
}
