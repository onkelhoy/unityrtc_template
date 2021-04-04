import express from "express";
import path from "path";
import dotenv from "dotenv";

import signalServer from "socket";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER || 8080;

const app = express();

// set up simple access request
// app.get("/", (_req, res) =>
//   res.status(200).sendFile(path.resolve(__dirname, "../public/index.html"))
// );

app.use(express.static(path.join(__dirname, "./public")));

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#mult(iple-servers-sharing-a-single-https-server
const server = app.listen(port, function () {
  console.log("Running UnityRTC-Server on port:", port);
});

server.on("upgrade", (request, socket, head) => {
  signalServer.handleUpgrade(request, socket, head, (socket) => {
    signalServer.emit("connection", socket, request);
  });
});
