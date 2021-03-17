import babel from "rollup-plugin-babel";
import babelrc from "babelrc-rollup";

export default {
  entry: "index.ts",
  dest: "blabla.js",
  plugins: [babel(babelrc())],
};
