const path = require("path")

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": true
        }
      }
    ]
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": true
      }
    ]
  ],
  exclude: "/node_modules\/(?!(workerpool)\/).*/",
  include: [
    "src/",
    path.join(__dirname, 'node_modules', 'workerpool'),
  ]
}