const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = (env, {mode}) => ({
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "docs") // using docs because github pages
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: "Collect gems in maze"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(docs|node_modules)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: mode === "development"
            }
          },
          "css-loader"
        ]
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
