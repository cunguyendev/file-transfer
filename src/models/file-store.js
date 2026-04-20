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
var file_store_exports = {};
__export(file_store_exports, {
  FileStore: () => FileStore
});
module.exports = __toCommonJS(file_store_exports);
var import_node_crypto = __toESM(require("node:crypto"));
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
const META_SUFFIX = ".meta.json";
const SCRYPT_KEYLEN = 64;
class FileStore {
  constructor(dir) {
    this.dir = dir;
    if (!import_node_fs.default.existsSync(dir)) {
      import_node_fs.default.mkdirSync(dir, { recursive: true });
    }
  }
  dir;
  get rootDir() {
    return this.dir;
  }
  list() {
    return import_node_fs.default.readdirSync(this.dir, { withFileTypes: true }).filter((entry) => entry.isFile() && !entry.name.endsWith(META_SUFFIX)).map((entry) => {
      const stat = import_node_fs.default.statSync(import_node_path.default.join(this.dir, entry.name));
      return {
        storedName: entry.name,
        size: stat.size,
        uploadedAt: stat.mtime.toISOString(),
        hasPassword: this.hasPassword(entry.name)
      };
    }).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }
  resolve(name) {
    if (name.endsWith(META_SUFFIX)) return null;
    const resolved = import_node_path.default.resolve(this.dir, name);
    const relative = import_node_path.default.relative(this.dir, resolved);
    if (relative.startsWith("..") || import_node_path.default.isAbsolute(relative)) return null;
    return resolved;
  }
  exists(name) {
    const p = this.resolve(name);
    return p !== null && import_node_fs.default.existsSync(p);
  }
  delete(name) {
    const p = this.resolve(name);
    if (!p || !import_node_fs.default.existsSync(p)) return false;
    import_node_fs.default.unlinkSync(p);
    const metaPath = this.metaPath(name);
    if (metaPath && import_node_fs.default.existsSync(metaPath)) import_node_fs.default.unlinkSync(metaPath);
    return true;
  }
  setPassword(name, password) {
    const metaPath = this.metaPath(name);
    if (!metaPath || !this.exists(name)) return false;
    const salt = import_node_crypto.default.randomBytes(16);
    const hash = import_node_crypto.default.scryptSync(password, salt, SCRYPT_KEYLEN);
    const meta = {
      passwordHash: `${salt.toString("hex")}:${hash.toString("hex")}`
    };
    import_node_fs.default.writeFileSync(metaPath, JSON.stringify(meta), "utf8");
    return true;
  }
  hasPassword(name) {
    const metaPath = this.metaPath(name);
    return metaPath !== null && import_node_fs.default.existsSync(metaPath);
  }
  verifyPassword(name, password) {
    const meta = this.readMeta(name);
    if (!meta) return false;
    const [saltHex, hashHex] = meta.passwordHash.split(":");
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = import_node_crypto.default.scryptSync(password, salt, expected.length);
    return actual.length === expected.length && import_node_crypto.default.timingSafeEqual(actual, expected);
  }
  metaPath(name) {
    const p = this.resolve(name);
    return p ? `${p}${META_SUFFIX}` : null;
  }
  readMeta(name) {
    const metaPath = this.metaPath(name);
    if (!metaPath || !import_node_fs.default.existsSync(metaPath)) return null;
    try {
      return JSON.parse(import_node_fs.default.readFileSync(metaPath, "utf8"));
    } catch {
      return null;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FileStore
});
