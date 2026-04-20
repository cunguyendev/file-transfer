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
var files_controller_exports = {};
__export(files_controller_exports, {
  FilesController: () => FilesController
});
module.exports = __toCommonJS(files_controller_exports);
class FilesController {
  constructor(store, io) {
    this.store = store;
    this.io = io;
  }
  store;
  io;
  list = (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(this.store.list());
  };
  upload = (req, res) => {
    const files = Array.isArray(req.files) ? req.files : [];
    const uploaded = files.map((f) => ({
      originalName: f.originalname,
      storedName: f.filename,
      size: f.size,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
    }));
    this.io.emit("files:new", uploaded);
    res.json({ success: true, files: uploaded });
  };
  download = (req, res) => {
    const filePath = this.store.resolve(req.params.filename);
    if (!filePath) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (!this.store.exists(req.params.filename)) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    res.download(filePath);
  };
  preview = (req, res) => {
    const filePath = this.store.resolve(req.params.filename);
    if (!filePath) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (!this.store.exists(req.params.filename)) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    res.sendFile(filePath);
  };
  remove = (req, res) => {
    const filePath = this.store.resolve(req.params.filename);
    if (!filePath) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (!this.store.delete(req.params.filename)) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    this.io.emit("files:deleted", req.params.filename);
    res.json({ success: true });
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FilesController
});
