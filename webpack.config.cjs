const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  stats: "errors-warnings",
  entry: "./www/scripts/index.js",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      { test: /\.css$/, use: [MiniCSSExtractPlugin.loader, "css-loader"] },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          { loader: "file-loader", options: { outputPath: "assets/images/" } },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          { loader: "file-loader", options: { outputPath: "assets/fonts/" } },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "www"),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [new MiniCSSExtractPlugin()],
};
