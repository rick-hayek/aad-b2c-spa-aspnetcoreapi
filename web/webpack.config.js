const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development", // production
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, 'dist') // dist is the default folder name while you can change it to any other name
  },
  devServer: {
    contentBase: './dist',
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [ { loader: "html-loader" } ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/public/index.html",
      filename: "./index.html" // relative path to the PATH from OUTPUT
    })
  ]
};