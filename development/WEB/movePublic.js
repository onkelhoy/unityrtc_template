const fse = require("fs-extra");
const path = require("path");

const srcDir = path.resolve(__dirname, "public");
const destDir = path.resolve(__dirname, "../../product");

console.log("source", srcDir);
console.log("dest", destDir);

// To copy a folder or file
fse.copySync(srcDir, destDir, function (err) {
  if (err) {
    console.error("ERROR", err);
  } else {
    console.log("success!");
  }
});
