// Import node path API
const path = require("path");

// html-webpack-plugin generates an HTML5 file that includes
// all webpack bundles in the <bod> using <script> tag
const HtmlWebPackPlugin = require("html-webpack-plugin");

// css-mini-extract-plugin extracts styles to an external stylesheet file,
// and injects it into HTML file by creating a <link> tag in <head> element
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require("./paths");

// Minimizing js assets
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// Minimizing css assets
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  mode: "production",
  entry: paths.entry,
  output: {
    filename: "bundle.[contenthash:16].js",
    path: paths.build // dist is the default folder name while you can change it to any other name
  },
  // optimization: {
  //   minimizer: [ // Override the default webpack minimizer
  //     new UglifyJsPlugin({}),
  //     new OptimizeCSSAssetsPlugin({})
  //   ],
  // },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [{ loader: "html-loader", options: { minimize: true } }]
      },
      {
        test: /\.(css)$/,
        use: [
          // process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: MiniCssExtractPlugin.loader },
          "css-loader"
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
      filename: paths.style + "app.[contenthash:16].css" // resulting stylesheet file
    })
  ],

  devServer: {
    contentBase: paths.build,
    port: 3000
  }
};
