const path = require("path");
// html-webpack-plugin generates an HTML5 file that includes
// all webpack bundles in the <bod> using <script> tag
const HtmlWebPackPlugin = require("html-webpack-plugin");

// css-mini-extract-plugin extracts styles to an external stylesheet file,
// and injects it into HTML file by creating a <link> tag in <head> element
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require("./paths");

module.exports = {
  mode: "development", // production
  entry: paths.entry,
  output: {
    filename: "[name].js",
    path: paths.build // dist is the default folder name while you can change it to any other name
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [{ loader: "html-loader" }]
      },
      {
        test: [/\.(css)$|\.(scss)$/],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          // "style-loader",
          "css-loader"
          //'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash:8].[ext]",
              outputPath: paths.image
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/public/index.html",
      filename: "index.html" // relative path to the PATH from OUTPUT
    }),
    new MiniCssExtractPlugin({
      filename: paths.style + "[name].css" // resulting stylesheet file
    })
  ],

  devServer: {
    contentBase: paths.build,
    port: 3000
  }
};
