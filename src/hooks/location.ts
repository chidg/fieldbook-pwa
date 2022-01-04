import { useEffect, useState, useCallback } from "react"
import { useUserContext } from "../contexts"

const locationAttributes: Array<keyof GeolocationCoordinates> = [
  "accuracy",
  "altitude",
  "altitudeAccuracy",
  "heading",
  "latitude",
  "longitude",
  "speed",
]

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

  const didLocationChange = useCallback(
    (newLocation: GeolocationCoordinates) => {
      if ((!newLocation && geoLocation) || (newLocation && !geoLocation))
        return true
      else
        return (
          locationAttributes.filter(
            (attribute) => geoLocation![attribute] !== newLocation[attribute]
          ).length > 0
        )
    },
    [geoLocation]
  )

  useEffect(() => {
    let watchId: number
    if (watchLocation) {
      watchId = navigator.geolocation.watchPosition(
        ({ coords }) => {
          // Necessary to do this transformation because the coords object is a prototype with getters rather than a normal object
          if (!geoLocation || didLocationChange(coords))
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
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const anyChanged = didLocationChange(coords)
        // Necessary to do this transformation because the coords object is a prototype with getters rather than a normal object
        if (!geoLocation || anyChanged)
          setGeoLocation({
            accuracy: coords.accuracy,
            altitude: coords.altitude,
            altitudeAccuracy: coords.altitudeAccuracy,
            heading: coords.heading,
            latitude: coords.latitude,
            longitude: coords.longitude,
            speed: coords.speed,
          })
      })
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchLocation, geoLocation, didLocationChange])

  return [geoLocation, geoLocationWarning]
}
