import { useEffect, useState } from "react"
import { useUserContext } from "../contexts"

export const useGeoLocation = (): [
  GeolocationCoordinates | undefined,
  number | undefined
] => {
  const {
    settings: { watchLocation },
  } = useUserContext()

  const [geoLocation, setGeoLocation] = useState<
    GeolocationCoordinates | undefined
  >(undefined)
  const [geoLocationWarning, setGeoLocationWarning] = useState<
    number | undefined
  >(undefined)

  // const [watchId, setWatchId] = useState<number>()

  useEffect(() => {
    let watchId: number
    if (watchLocation) {
      console.log("getting location from watch")
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
        (positionError) => setGeoLocationWarning(positionError.code),
        { enableHighAccuracy: true }
      )
    } else {
      console.log("getting location once")
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