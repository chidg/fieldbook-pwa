const path = require("path")
const CracoAlias = require("craco-alias")

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  babel: {
    loaderOptions: {
      ignore: ["./node_modules/mapbox-gl/dist/mapbox-gl.js"],
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: "./src",
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: "./tsconfig.paths.json",
      },
    },
  ],
  resolve: {
    alias: {
      "app/common": path.resolve(__dirname, "src/components/common/"),
      "app/hooks": path.resolve(__dirname, "src/hooks/"),
      "app/contexts": path.resolve(__dirname, "src/contexts/"),
    },
  },
}
