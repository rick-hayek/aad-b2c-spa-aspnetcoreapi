module.exports = {
  mode: "development", // production
  entry: "./src/index.js",
  devServer: {
    contentBase: './dist',
    port: 3000
  },
  output: {
    filename: "bundle.js"
  }
};