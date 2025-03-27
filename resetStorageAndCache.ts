function resetStorageAndCache() {
  window.localStorage.setItem(
    "data",
    JSON.stringify({
      "970dd498-1802-4328-b8cd-628755452c51": {
        density: "4",
        notes: "",
        idConfidence: 2,
        size: "0",
        taxon: "0",
        otherTaxon: "",
        id: "970dd498-1802-4328-b8cd-628755452c51",
        timestamp: 1739251840241,
        location: {
          accuracy: 271950.1405560659,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: -32.145408,
          longitude: 115.8643712,
          speed: null,
        },
      },
      "970dd498-1802-4328-b8cd-628755452c52": {
        density: "4",
        notes: "",
        idConfidence: 2,
        size: "1",
        taxon: "3",
        otherTaxon: "",
        id: "970dd498-1802-4328-b8cd-628755452c52",
        timestamp: 1739251840241,
        location: {
          accuracy: 271950.1405560659,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: -32.165408,
          longitude: 115.8643712,
          speed: null,
        },
      },
      "970dd498-1802-4328-b8cd-628755452c53": {
        density: "4",
        notes: "",
        idConfidence: 2,
        size: "2",
        taxon: "6",
        otherTaxon: "",
        id: "970dd498-1802-4328-b8cd-628755452c53",
        timestamp: 1739251840241,
        location: {
          accuracy: 271950.1405560659,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: -32.185408,
          longitude: 115.8543712,
          speed: null,
        },
      },
    })
  )

  window.localStorage.removeItem("fieldBookMigrations")

  window.caches
    .delete("workbox-precache")
    .then(() => {
      window.caches.delete("workbox-precache-v2-http://localhost:5173/")
    })
    .then(() => {
      console.log("caches deleted")
    })
}

resetStorageAndCache()
