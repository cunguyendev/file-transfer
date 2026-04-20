"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sockets_exports = {};
__export(sockets_exports, {
  setupSockets: () => setupSockets
});
module.exports = __toCommonJS(sockets_exports);
function setupSockets(io, registry) {
  io.on("connection", (socket) => {
    const info = {
      id: socket.id,
      ip: socket.handshake.address,
      userAgent: socket.handshake.headers["user-agent"] ?? "Unknown",
      connectedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    registry.add(info);
    io.emit("devices:update", registry.list());
    socket.on("disconnect", () => {
      registry.remove(socket.id);
      io.emit("devices:update", registry.list());
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setupSockets
});
