"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = __importDefault(require("./socket"));
// initialize configuration
dotenv_1.default.config();
// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER || 8080;
const app = express_1.default();
// set up simple access request
// app.get("/", (_req, res) =>
//   res.status(200).sendFile(path.resolve(__dirname, "../public/index.html"))
// );
app.use(express_1.default.static(path_1.default.join(__dirname, "./public")));
// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#mult(iple-servers-sharing-a-single-https-server
const server = app.listen(port, function () {
    console.log("Running UnityRTC-Template-Server on port:", port);
});
server.on("upgrade", (request, socket, head) => {
    socket_1.default.handleUpgrade(request, socket, head, (socket) => {
        socket_1.default.emit("connection", socket, request);
    });
});
