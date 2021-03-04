const nodeExternals = require("webpack-node-externals");
const path = require("path");

const { NODE_ENV = "production" } = process.env;

module.exports = {
  watch: NODE_ENV === "development",
  mode: NODE_ENV,
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [nodeExternals()],
  entry: "./client/index.ts",
  output: {
    path: path.resolve(__dirname, "../../../../product/public"),
    filename: "client.js",
  },

  target: "node",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        exclude: [/node_modules/, "/server/"],
      },
    ],
  },
};
