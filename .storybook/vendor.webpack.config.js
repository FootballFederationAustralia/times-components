const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "web",
  context: process.cwd(),
  entry: {
    vendor: ["prop-types", "react", "react-dom", "react-native-web"]
  },

  output: {
    filename: "[name].dll.js",
    path: path.resolve("./dist/public"),
    library: "[name]"
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join("./dist/public", "[name]-manifest.json"),
      name: "[name]",
      context: path.resolve(__dirname)
    })
  ]
};
