"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var routes_exports = {};
__export(routes_exports, {
  registerRoutes: () => registerRoutes
});
module.exports = __toCommonJS(routes_exports);
var import_express = __toESM(require("express"));
var import_update_checker = require("./update-checker");
function registerRoutes(app, controller, upload, publicDir) {
  app.use(import_express.default.json());
  app.use(import_express.default.static(publicDir));
  app.get("/files", controller.list);
  app.post("/upload", upload.array("files"), controller.upload);
  app.get("/download/:filename", controller.download);
  app.get("/preview/:filename", controller.preview);
  app.delete("/files/:filename", controller.remove);
  app.get("/version", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json((0, import_update_checker.getUpdateInfo)());
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerRoutes
});
