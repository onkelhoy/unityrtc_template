const nodeExternals = require("webpack-node-externals");
const path = require("path");

const { NODE_ENV = "production" } = process.env;

module.exports = {
  watch: NODE_ENV === "development",
  mode: NODE_ENV,
  // devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [nodeExternals()],
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "../../build/public"),
    filename: "client.js",
  },

  target: "web",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
    ],
  },
};
