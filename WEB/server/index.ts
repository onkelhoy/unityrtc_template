import express from "express";
import path from "path";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

import { SET_UNITY_PREFERENCE } from './common';
import signalServer from "./socket";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER || 8080;

const app = express();


// parse application/json
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

// set up simple access request
// app.get("/", (_req, res) =>
//   res.status(200).sendFile(path.resolve(__dirname, "../public/index.html"))
// );


app.post('/set-unity-preference', function (req, res) {
  const screenInfo = req.body as SET_UNITY_PREFERENCE;
  console.log(screenInfo);

  // Cache.set(`${screenInfo.room}${screenInfo.id}`, 'game/desktop/');

  res.status(200).json({ name: 'lala' });
});

app.get('/', function (_req, res) {
  console.log('requst here');
  res.status(200).sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/Build/:file', function(req, res) {
  const params = req.params as { file:string };
  console.log("requesting file:", params.file);
  const gameLocation = '/game/lala/Build'

  console.log(path.join(__dirname, gameLocation, params.file));

  res.status(200).sendFile(path.join(__dirname, gameLocation, params.file));
})

app.use('/public', express.static(path.join(__dirname, "public")));


// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#mult(iple-servers-sharing-a-single-https-server
const server = app.listen(port, function () {
  console.log("Running UnityRTC-Template-Server on port:", port);
});

server.on("upgrade", (request, socket, head) => {
  signalServer.handleUpgrade(request, socket, head, (socket) => {
    signalServer.emit("connection", socket, request);
  });
});
