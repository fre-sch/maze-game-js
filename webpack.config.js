const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Collect gems in maze"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(dist|node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist")
  }
}
