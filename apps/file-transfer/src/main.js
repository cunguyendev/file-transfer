"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_node_http = __toESM(require("node:http"));
var import_node_os = __toESM(require("node:os"));
var import_socket = require("socket.io");
var import_config = require("./config");
var import_file_store = require("./models/file-store");
var import_device_registry = require("./models/device-registry");
var import_upload = require("./middleware/upload");
var import_files_controller = require("./controllers/files-controller");
var import_routes = require("./routes");
var import_sockets = require("./sockets");
function getLocalIPs() {
  const interfaces = import_node_os.default.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (iface.family === "IPv4" && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}
const store = new import_file_store.FileStore(import_config.config.uploadsDir);
const devices = new import_device_registry.DeviceRegistry();
const app = (0, import_express.default)();
const server = import_node_http.default.createServer(app);
const io = new import_socket.Server(server);
const upload = (0, import_upload.createUploadMiddleware)(import_config.config.uploadsDir);
const controller = new import_files_controller.FilesController(store, io);
(0, import_routes.registerRoutes)(app, controller, upload, import_config.config.publicDir);
(0, import_sockets.setupSockets)(io, devices);
server.listen(import_config.config.port, import_config.config.host, () => {
  console.log(`
  file-transfer is running!
`);
  console.log(`  Local:    http://localhost:${import_config.config.port}`);
  for (const ip of getLocalIPs()) {
    console.log(`  Network:  http://${ip}:${import_config.config.port}`);
  }
  console.log(`  Uploads:  ${import_config.config.uploadsDir}
`);
});
