const path = require("path");

const buildDir = "build";
const assetsDir = "assets/";
const imagesDir = "image/";
const stylesDir = "style/";

module.exports = {
  entry: "./src/index.js",
  build: path.join(__dirname, buildDir),
  image: assetsDir.concat(imagesDir),
  style: assetsDir.concat(stylesDir)
};
