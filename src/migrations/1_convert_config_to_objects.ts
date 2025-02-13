// migration.ts

import { Data } from "@/contexts/data"

export const MAPPINGS = {
  taxon: {
    originalArray: [
      "Arum Lily",
      "Sydney Golden Wattle",
      "Flinders Range Wattle",
      "Blackwood (Blackwood Wattle)",
      "Sweet Pittosporum",
      "Olive",
      "Victorian Teatree",
      "Fig",
      "Polygala",
      "Broom (Genista species)",
      "Dolichos",
      "Asparagus Fern (Asparagus scandens)",
      "Blackberry",
      "Other",
    ],
    newMapping: {
      arum: "Arum Lily",
      wattle: "Sydney Golden Wattle",
      flinders: "Flinders Range Wattle",
      blackwood: "Blackwood (Blackwood Wattle)",
      pittosporum: "Sweet Pittosporum",
      olive: "Olive",
      teatree: "Victorian Teatree",
      fig: "Fig",
      polygala: "Polygala",
      broom: "Broom (Genista species)",
      dolichos: "Dolichos",
      asparagus: "Asparagus Fern (Asparagus scandens)",
      blackberry: "Blackberry",
      other: "Other",
    },
  },
  size: {
    originalArray: [
      "Mostly small young plants",
      "Mixed aged plants",
      "Mostly large mature plants",
    ],
    newMapping: {
      small: "Mostly small young plants",
      mixed: "Mixed aged plants",
      large: "Mostly large mature plants",
    },
  },
  density: {
    originalArray: [
      "Absent",
      "Individual plant",
      "Isolated or few scattered plants ",
      "Many scattered or clumped plants",
      "Large dense infestation, less than 20 x 20 m",
      "Extensive dense infestation, greater than 20 x 20 m",
    ],
    newMapping: {
      absent: "Absent",
      individual: "Individual plant",
      scattered: "Isolated or few scattered plants ",
      clumped: "Many scattered or clumped plants",
      dense: "Large dense infestation, less than 20 x 20 m",
      extensive: "Extensive dense infestation, greater than 20 x 20 m",
    },
  },
}

// Create reverse mappings
const createIndexToKeyMap = (mapping: any) => {
  return Object.entries(mapping.newMapping).reduce((acc: any, [key, value]) => {
    const index = mapping.originalArray.indexOf(value)
    acc[index] = key
    return acc
  }, {})
}

const indexMaps = {
  taxon: createIndexToKeyMap(MAPPINGS.taxon),
  size: createIndexToKeyMap(MAPPINGS.size),
  density: createIndexToKeyMap(MAPPINGS.density),
}

export function migrateData(data: any) {
  if (typeof data !== "object" || data === null) {
    return data
  }

  const result = { ...data }

  if ("taxon" in result) {
    const taxonIndex = parseInt(result.taxon, 10)
    if (!isNaN(taxonIndex) && indexMaps.taxon[taxonIndex]) {
      result.taxon = indexMaps.taxon[taxonIndex]
    }
  }

  if ("size" in result) {
    const sizeIndex = parseInt(result.size, 10)
    if (!isNaN(sizeIndex) && indexMaps.size[sizeIndex]) {
      result.size = indexMaps.size[sizeIndex]
    }
  }

  if ("density" in result) {
    const densityIndex = parseInt(result.density, 10)
    if (!isNaN(densityIndex) && indexMaps.density[densityIndex]) {
      result.density = indexMaps.density[densityIndex]
    }
  }

  return result
}

export function performMigration() {
  const migration = JSON.parse(
    localStorage.getItem("fieldBookMigrations") || "{}"
  )
  if (migration[1]) return false

  try {
    // Get data from localStorage
    const data: Data = JSON.parse(localStorage.getItem("data") || "{}")

    // check if any data items have already been migrated:
    if (Object.values(data).length > 0) {
      if (Object.values(data)[0].taxon in MAPPINGS.taxon) return false

      // otherwise migrate the data
      const migratedData = Object.fromEntries(
        Object.entries(data).map(([id, value]) => [id, migrateData(value)])
      )

      // Save back to localStorage
      localStorage.setItem("data", JSON.stringify(migratedData))
    }
    localStorage.setItem(
      "fieldBookMigrations",
      JSON.stringify({ 1: Date.now() })
    )
    return true
  } catch (error) {
    console.error("Migration failed:", error)
    return false
  }
}
