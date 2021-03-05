const fs = require("fs");
const path = require("path");

const link = path.resolve(__dirname, "../../product/public/client.js");

fs.readFile(link, "utf8", (err, strdata) => {
  if (err) {
    console.error("ERROR", err);
    return;
  }

  const target = 'require("unityrtc-types")';
  const retouched = strdata.replace(target, "2");

  fs.writeFile(link, retouched, function (err) {
    if (err) return console.log(err);
  });
});
