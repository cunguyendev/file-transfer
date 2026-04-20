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
var update_checker_exports = {};
__export(update_checker_exports, {
  getUpdateInfo: () => getUpdateInfo,
  startUpdateChecker: () => startUpdateChecker
});
module.exports = __toCommonJS(update_checker_exports);
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
const CHECK_INTERVAL_MS = 60 * 60 * 1e3;
function readPackageJson() {
  try {
    const p = import_node_path.default.join(__dirname, "..", "package.json");
    return JSON.parse(import_node_fs.default.readFileSync(p, "utf8"));
  } catch {
    return {};
  }
}
function resolveRepoSlug(pkg2) {
  if (process.env.FT_REPO) return process.env.FT_REPO;
  const repo = pkg2["repository"];
  const url = typeof repo === "string" ? repo : repo && typeof repo === "object" && "url" in repo ? repo.url : null;
  if (!url) return null;
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+?)(?:\.git)?$/);
  return match ? `${match[1]}/${match[2]}` : null;
}
function compareSemver(a, b) {
  const ap = a.split(".").map((n) => Number(n) || 0);
  const bp = b.split(".").map((n) => Number(n) || 0);
  for (let i = 0; i < 3; i++) {
    const av = ap[i] ?? 0;
    const bv = bp[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}
const pkg = readPackageJson();
const repoSlug = resolveRepoSlug(pkg);
let state = {
  current: pkg["version"] ?? "0.0.0",
  latest: null,
  updateAvailable: false,
  releaseUrl: null,
  repo: repoSlug,
  checkedAt: (/* @__PURE__ */ new Date(0)).toISOString()
};
function getUpdateInfo() {
  return state;
}
async function checkForUpdates(io) {
  if (!repoSlug) return;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoSlug}/tags?per_page=1`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return;
    const tags = await res.json();
    if (!Array.isArray(tags) || tags.length === 0) return;
    const latest = tags[0].name;
    const updateAvailable = compareSemver(latest, state.current) > 0;
    const wasAvailable = state.updateAvailable;
    state = {
      ...state,
      latest,
      updateAvailable,
      releaseUrl: `https://github.com/${repoSlug}/releases/tag/${latest}`,
      checkedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (io && updateAvailable && !wasAvailable) {
      io.emit("update:available", state);
    }
  } catch {
  }
}
function startUpdateChecker(io) {
  if (!repoSlug) return;
  void checkForUpdates(io);
  setInterval(() => void checkForUpdates(io), CHECK_INTERVAL_MS).unref();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUpdateInfo,
  startUpdateChecker
});
