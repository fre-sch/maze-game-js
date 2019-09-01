const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = (env, {mode}) => ({
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "docs") // using docs because github pages
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
        test: /\.css$/,
        exclude: /(docs|node_modules)/,
        loaders: (mode === "production"
          ? [
            "file-loader",
            "extract-loader",
            "css-loader"
          ]
          : [
            "style-loader",
            {
              loader: "css-loader",
              options: {sourceMap: true}
            }
          ]
        )
      },
      {
        test: /\.js$/,
        exclude: /(docs|node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "docs") // using docs because github pages
  }
})
